import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor config for the QuranCall APK build.
 * The APK loads the published web app, so web updates ship without rebuilding
 * the APK, while native screen sharing (MediaProjection) runs on-device.
 */
const config: CapacitorConfig = {
  appId: "app.qurancall",
  appName: "QuranCall",
  webDir: "dist",
  server: {
    url: "https://quranc1.lovable.app",
    cleartext: false,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {},
};

export default config;
