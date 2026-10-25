#!/bin/zsh
# Builds GYST.app and GYST.dmg using only tools that ship with macOS.
set -euo pipefail
cd "$(dirname "$0")"
ROOT="$PWD"
OUT="$ROOT/dist"
APP="$OUT/GYST.app"
VERSION="1.0"
rm -rf "$OUT"; mkdir -p "$OUT"

echo "› compiling applet"
osacompile -l JavaScript -s -o "$APP" main.js

echo "› copying web UI"
cp -R web "$APP/Contents/Resources/web"

echo "› rendering icon"
ICONSET="$OUT/GYST.iconset"; mkdir -p "$ICONSET"
QL="$OUT/ql"; mkdir -p "$QL"
qlmanage -t -s 1024 -o "$QL" "$ROOT/icon.svg" >/dev/null 2>&1
mv "$QL/icon.svg.png" "$OUT/icon-1024.png"; rm -rf "$QL"
for s in 16 32 128 256 512; do
  sips -z $s $s "$OUT/icon-1024.png" --out "$ICONSET/icon_${s}x${s}.png" >/dev/null
  sips -z $((s*2)) $((s*2)) "$OUT/icon-1024.png" --out "$ICONSET/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$ICONSET" -o "$APP/Contents/Resources/applet.icns"
rm -rf "$ICONSET"

echo "› writing Info.plist"
PL="$APP/Contents/Info.plist"
plutil -replace CFBundleName -string "GYST" "$PL"
plutil -replace CFBundleDisplayName -string "GYST" "$PL"
plutil -replace CFBundleIdentifier -string "com.gyst.planner" "$PL"
plutil -replace CFBundleShortVersionString -string "$VERSION" "$PL"
plutil -replace CFBundleVersion -string "$VERSION" "$PL"
plutil -replace NSHighResolutionCapable -bool YES "$PL"
plutil -replace NSHumanReadableCopyright -string "Get your shit together." "$PL"
plutil -replace LSApplicationCategoryType -string "public.app-category.productivity" "$PL"
rm -f "$APP/Contents/Resources/Assets.car" 2>/dev/null || true
plutil -remove CFBundleIconName "$PL" 2>/dev/null || true

echo "› signing (ad-hoc)"
xattr -cr "$APP"
codesign --force --deep --sign - "$APP"

echo "› building dmg"
STAGE="$OUT/dmg"; mkdir -p "$STAGE"
cp -R "$APP" "$STAGE/"
cp "$ROOT/How to open GYST.txt" "$STAGE/"
ln -s /Applications "$STAGE/Applications"
hdiutil create -volname "GYST" -srcfolder "$STAGE" -ov -format UDZO -fs HFS+ "$OUT/GYST.dmg" >/dev/null
rm -rf "$STAGE"
echo "✓ $OUT/GYST.dmg"
