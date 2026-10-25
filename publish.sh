#!/bin/zsh
# Sends a new version of GYST's interface to her app. Usage: ./publish.sh "what changed"
# Her copy checks GitHub on launch and every few hours, then shows a "Refresh" banner.
# Only files in web/ update this way; changes to main.js need a new DMG.
set -euo pipefail
cd "$(dirname "$0")"
NOTES="${1:-}"
V=$(python3 - "$NOTES" <<'EOF'
import json, sys
p = 'web/version.json'; d = json.load(open(p))
d['version'] += 1; d['notes'] = sys.argv[1]
json.dump(d, open(p, 'w'), indent=2); open(p, 'a').write('\n')
print(d['version'])
EOF
)
git add -A
git commit -qm "GYST v$V${NOTES:+: $NOTES}"
git push -q origin main
echo "✓ Published v$V — her app will pick it up within a few hours (or on next launch)."
