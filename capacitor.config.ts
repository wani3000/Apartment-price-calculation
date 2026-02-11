import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aptgugu.calculator",
  appName: "아파트 대출 계산기",
  webDir: "out",
  ios: {
    contentInset: "automatic",
  },
};

export default config;
