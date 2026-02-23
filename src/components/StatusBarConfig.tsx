"use client";

import { useEffect } from "react";

export default function StatusBarConfig() {
  useEffect(() => {
    // StatusBar 설정 (iOS)
    if (typeof window !== "undefined") {
      import("@capacitor/status-bar")
        .then(({ StatusBar, Style }) => {
          StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
          StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
          StatusBar.setBackgroundColor({ color: "#ffffff" }).catch(() => {});
        })
        .catch(() => {});
    }
  }, []);

  return null;
}
