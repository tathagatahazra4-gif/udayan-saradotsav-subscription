import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.udayan.subscription",
  appName: "Udayan Saradotsav Subscription",
  webDir: "public",

  server: {
    url: "https://udayan-saradotsav-subscription.vercel.app",
    cleartext: false,
  },
};

export default config;