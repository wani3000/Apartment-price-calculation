import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aptgugu.calculator",
  appName: "aptgugu",
  webDir: "out",
  ios: {
    contentInset: "automatic",
  },
  plugins: {
    StatusBar: {
      style: "light",
      backgroundColor: "#ffffff",
    },
  },
};

export default config;
