"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

export default function StatusBarConfig() {
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    document.body.dataset.platform = platform;

    // StatusBar 설정 (iOS)
    if (typeof window !== "undefined" && platform === "ios") {
      import("@capacitor/status-bar")
        .then(({ StatusBar, Style }) => {
          StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
          StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
          StatusBar.setBackgroundColor({ color: "#ffffff" }).catch(() => {});
        })
        .catch(() => {});
    }

    return () => {
      delete document.body.dataset.platform;
    };
  }, []);

  return null;
}
