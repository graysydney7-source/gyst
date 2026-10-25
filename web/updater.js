/* GYST — checks GitHub for a newer version of the app's web files and hands it to the native shell. */
(() => {
  const BASE = 'https://raw.githubusercontent.com/graysydney7-source/gyst/main/web/';
  const NATIVE = !!window.__GY_NATIVE, CUR = window.__GY_WEB_VERSION || 0;
  let pending = 0, busy = false;

  // returns 'updated' | 'current' | 'offline'
  async function check() {
    if (!NATIVE || busy) return 'current';
    busy = true;
    try {
      const bust = '?t=' + Date.now();
      const r = await fetch(BASE + 'version.json' + bust, { cache: 'no-store' });
      if (!r.ok) return 'offline';
      const m = await r.json();
      if (!(m.version > CUR) || !Array.isArray(m.files)) return 'current';
      if (m.version <= pending) return 'updated';
      const files = { 'version.json': JSON.stringify(m) };
      for (const f of m.files) {
        if (!/^[\w.-]+$/.test(f)) return 'offline';
        const fr = await fetch(BASE + f + bust, { cache: 'no-store' });
        if (!fr.ok) return 'offline';
        files[f] = await fr.text();
      }
      if (!files['index.html']) return 'offline';
      window.webkit.messageHandlers.installUpdate.postMessage(JSON.stringify({ version: m.version, notes: m.notes || '', files }));
      notes = m.notes || '';
      return 'updated';
    } catch (e) { return 'offline'; }
    finally { busy = false; }
  }
  let notes = '';

  function banner(v) {
    let b = document.getElementById('update-banner');
    if (!b) { b = document.createElement('div'); b.id = 'update-banner'; document.body.appendChild(b); }
    b.innerHTML = `<span>✨ A new version of GYST is ready${notes ? ` — <i></i>` : ''}</span><button type="button">Refresh</button>`;
    if (notes) b.querySelector('i').textContent = notes;
    b.querySelector('button').onclick = () => {
      try { window.GY && GY.flush && GY.flush(); } catch (e) { }
      setTimeout(() => window.webkit.messageHandlers.reloadApp.postMessage(''), 150);
    };
  }

  window.GYUpdate = {
    version: CUR,
    check,
    ready(v) { pending = v; banner(v); },
  };
  if (NATIVE) {
    addEventListener('load', () => setTimeout(check, 5000));
    setInterval(check, 3 * 3600e3);
  }
})();
