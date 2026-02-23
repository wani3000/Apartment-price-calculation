import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aptgugu.calculator",
  appName: "아파트구구-대출계산기",
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
