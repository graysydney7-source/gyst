// GYST — native macOS shell (JavaScript for Automation applet hosting a WKWebView).
ObjC.import('Cocoa');
ObjC.import('WebKit');

var win = null, web = null, bridge = null;
var fm = $.NSFileManager.defaultManager;
var supportDir = $('~/Library/Application Support/GYST').stringByExpandingTildeInPath.js;
var dataPath = supportDir + '/gyst-data.json';
var backupDir = supportDir + '/backups';
var appDir = supportDir + '/app';   // downloaded updates of the web UI live here
var bundledWeb = $.NSBundle.mainBundle.resourcePath.js + '/web';
var ucc = null, bootTimer = null;

function ensureDirs() {
  fm.createDirectoryAtPathWithIntermediateDirectoriesAttributesError($(backupDir), true, $(), null);
}
function readFile(p) {
  var s = $.NSString.stringWithContentsOfFileEncodingError($(p), $.NSUTF8StringEncoding, null);
  return (s && !s.isNil()) ? s.js : null;
}
function writeFile(p, str) {
  return $(str).writeToFileAtomicallyEncodingError($(p), true, $.NSUTF8StringEncoding, null);
}
function dailyBackup() {
  var d = new Date();
  var stamp = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  var dest = backupDir + '/gyst-' + stamp + '.json';
  if (fm.fileExistsAtPath($(dataPath)) && !fm.fileExistsAtPath($(dest))) {
    fm.copyItemAtPathToPathError($(dataPath), $(dest), null);
  }
}

/* ---------- web UI versions & updates ---------- */
function webVersion(dir) { var t = readFile(dir + '/version.json'); try { return t ? (JSON.parse(t).version || 0) : 0; } catch (e) { return 0; } }
function pickRoot() {
  var bv = webVersion(bundledWeb), dv = webVersion(appDir), bad = +(readFile(supportDir + '/bad-version') || 0);
  if (dv > bv && dv !== bad && fm.fileExistsAtPath($(appDir + '/index.html'))) return { dir: appDir, v: dv };
  return { dir: bundledWeb, v: bv };
}
function loadWeb(forceBundled) {
  var r = forceBundled ? { dir: bundledWeb, v: webVersion(bundledWeb) } : pickRoot();
  var boot = 'window.__GY_NATIVE = true; window.__GY_WEB_VERSION = ' + r.v + '; window.__GY_SAVED_RAW = ' + JSON.stringify(readFile(dataPath) || '') + ';';
  ucc.removeAllUserScripts;
  ucc.addUserScript($.WKUserScript.alloc.initWithSourceInjectionTimeForMainFrameOnly($(boot), 0, true));
  web.loadFileURLAllowingReadAccessToURL($.NSURL.fileURLWithPath($(r.dir + '/index.html')), $.NSURL.fileURLWithPath($(r.dir)));
  if (bootTimer) { bootTimer.invalidate; bootTimer = null; }
  // a downloaded version that doesn't report in within 12s is marked bad and we fall back to the bundled one
  if (r.dir === appDir) bootTimer = $.NSTimer.scheduledTimerWithTimeIntervalRepeatsBlock(12, false, function () {
    bootTimer = null; writeFile(supportDir + '/bad-version', String(r.v)); loadWeb(true);
  });
}
function installUpdate(json) {
  var u = JSON.parse(json), tmp = appDir + '.new', names = Object.keys(u.files || {});
  if (!(u.version > 0) || names.indexOf('index.html') < 0 || names.indexOf('version.json') < 0) return;
  fm.removeItemAtPathError($(tmp), null);
  fm.createDirectoryAtPathWithIntermediateDirectoriesAttributesError($(tmp), true, $(), null);
  for (var i = 0; i < names.length; i++) {
    if (!/^[A-Za-z0-9_.-]+$/.test(names[i])) return;
    if (!writeFile(tmp + '/' + names[i], u.files[names[i]])) return;
  }
  fm.removeItemAtPathError($(appDir), null);
  fm.moveItemAtPathToPathError($(tmp), $(appDir), null);
  web.evaluateJavaScriptCompletionHandler($('window.GYUpdate && GYUpdate.ready(' + (+u.version) + ')'), null);
}

ObjC.registerSubclass({
  name: 'GYBridge',
  superclass: 'NSObject',
  protocols: ['WKScriptMessageHandler'],
  methods: {
    'userContentController:didReceiveScriptMessage:': {
      types: ['void', ['id', 'id']],
      implementation: function (ucc, message) {
        try {
          var name = message.name.js;
          if (name === 'save') {
            writeFile(dataPath, message.body.js);
          } else if (name === 'exportData') {
            var sp = $.NSSavePanel.savePanel;
            sp.nameFieldStringValue = $('gyst-backup.json');
            if (sp.runModal == 1) writeFile(sp.URL.path.js, message.body.js);
          } else if (name === 'openURL') {
            var u = message.body.js;
            if (/^https?:\/\//i.test(u)) $.NSWorkspace.sharedWorkspace.openURL($.NSURL.URLWithString($(u)));
          } else if (name === 'booted') {
            if (bootTimer) { bootTimer.invalidate; bootTimer = null; }
          } else if (name === 'installUpdate') {
            installUpdate(message.body.js);
          } else if (name === 'reloadApp') {
            loadWeb(false);
          } else if (name === 'importData') {
            var op = $.NSOpenPanel.openPanel;
            op.allowsMultipleSelection = false;
            if (op.runModal == 1) {
              var txt = readFile(op.URLs.objectAtIndex(0).path.js);
              if (txt) web.evaluateJavaScriptCompletionHandler($('GY.importData(' + JSON.stringify(txt) + ')'), null);
            }
          }
        } catch (e) { }
      }
    }
  }
});

function buildMenu() {
  var app = $.NSApplication.sharedApplication;
  var bar = $.NSMenu.alloc.init;
  function item(menu, title, sel, key, mods) {
    var it = $.NSMenuItem.alloc.initWithTitleActionKeyEquivalent($(title), sel, $(key || ''));
    if (mods !== undefined) it.keyEquivalentModifierMask = mods;
    menu.addItem(it); return it;
  }
  function sub(title) {
    var top = $.NSMenuItem.alloc.init; var m = $.NSMenu.alloc.initWithTitle($(title));
    top.submenu = m; bar.addItem(top); return m;
  }
  var a = sub('GYST');
  item(a, 'About GYST', 'orderFrontStandardAboutPanel:', '');
  a.addItem($.NSMenuItem.separatorItem);
  item(a, 'Hide GYST', 'hide:', 'h');
  item(a, 'Hide Others', 'hideOtherApplications:', 'h', (1 << 20) | (1 << 19));
  item(a, 'Show All', 'unhideAllApplications:', '');
  a.addItem($.NSMenuItem.separatorItem);
  item(a, 'Quit GYST', 'terminate:', 'q');
  var e = sub('Edit');
  item(e, 'Undo', 'undo:', 'z');
  item(e, 'Redo', 'redo:', 'Z');
  e.addItem($.NSMenuItem.separatorItem);
  item(e, 'Cut', 'cut:', 'x');
  item(e, 'Copy', 'copy:', 'c');
  item(e, 'Paste', 'paste:', 'v');
  item(e, 'Select All', 'selectAll:', 'a');
  var v = sub('View');
  item(v, 'Enter Full Screen', 'toggleFullScreen:', 'f', (1 << 20) | (1 << 18));
  var w = sub('Window');
  item(w, 'Minimize', 'performMiniaturize:', 'm');
  item(w, 'Zoom', 'performZoom:', '');
  item(w, 'Close', 'performClose:', 'w');
  app.mainMenu = bar;
  app.windowsMenu = w;
}

function run() {
  ensureDirs();
  dailyBackup();

  var config = $.WKWebViewConfiguration.alloc.init;
  ucc = config.userContentController;
  bridge = $.GYBridge.alloc.init;
  ['save', 'exportData', 'importData', 'openURL', 'booted', 'installUpdate', 'reloadApp'].forEach(function (n) { ucc.addScriptMessageHandlerName(bridge, n); });
  try { config.mediaTypesRequiringUserActionForPlayback = 0; } catch (e) { }
  try { config.preferences.inactiveSchedulingPolicy = 2; } catch (e) { }

  var mask = 1 | 2 | 4 | 8 | 32768; // titled, closable, miniaturizable, resizable, full-size content
  win = $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer($.NSMakeRect(0, 0, 1320, 860), mask, 2, false);
  win.titlebarAppearsTransparent = true;
  win.titleVisibility = 1;
  win.title = $('GYST');
  win.minSize = $.NSMakeSize(1000, 660);
  win.backgroundColor = $.NSColor.colorWithSRGBRedGreenBlueAlpha(0.98, 0.96, 0.94, 1);
  win.releasedWhenClosed = false;
  win.collectionBehavior = 1 << 7; // full screen primary
  if (!win.setFrameUsingName($('GYSTMain'))) win.center;
  win.setFrameAutosaveName($('GYSTMain'));

  web = $.WKWebView.alloc.initWithFrameConfiguration(win.contentView.bounds, config);
  web.autoresizingMask = 2 | 16;
  try { web.setValueForKey($.NSNumber.numberWithBool(false), $('drawsBackground')); } catch (e) { }
  try { web.inspectable = true; } catch (e) { }
  win.contentView.addSubview(web);

  loadWeb(false);

  buildMenu();
  win.makeKeyAndOrderFront(null);
  $.NSApplication.sharedApplication.activateIgnoringOtherApps(true);
}

function reopen() {
  if (win) win.makeKeyAndOrderFront(null);
}
