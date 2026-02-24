#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

TAB_FILE="$ROOT_DIR/src/components/BottomTabBar.tsx"
GLOBAL_CSS="$ROOT_DIR/src/app/globals.css"

if ! grep -q 'className="app-bottom-tab"' "$TAB_FILE"; then
  echo "[check-bottom-layout] BottomTabBar must use app-bottom-tab class." >&2
  exit 1
fi

if ! grep -q 'className="app-bottom-tab-inner"' "$TAB_FILE"; then
  echo "[check-bottom-layout] BottomTabBar must use app-bottom-tab-inner class." >&2
  exit 1
fi

if grep -q 'safe-area-inset-bottom' "$TAB_FILE"; then
  echo "[check-bottom-layout] Do not use safe-area-inset-bottom directly in BottomTabBar.tsx." >&2
  exit 1
fi

if ! grep -q '\.bottom-cta-container' "$GLOBAL_CSS"; then
  echo "[check-bottom-layout] .bottom-cta-container rule is missing in globals.css." >&2
  exit 1
fi

if ! grep -A4 '\.bottom-cta-container' "$GLOBAL_CSS" | grep -q 'bottom: 0;'; then
  echo "[check-bottom-layout] .bottom-cta-container must use bottom: 0." >&2
  exit 1
fi

if ! grep -A5 '\.bottom-cta-container' "$GLOBAL_CSS" | grep -q 'padding-bottom: var(--bottom-safe-area);'; then
  echo "[check-bottom-layout] .bottom-cta-container must use var(--bottom-safe-area) padding." >&2
  exit 1
fi

echo "[check-bottom-layout] OK"
