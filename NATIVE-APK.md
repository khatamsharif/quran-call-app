# QuranCall — Native APK build (real screen sharing like WhatsApp/Teams)

Web browsers on phones **cannot** capture the screen (`getDisplayMedia` is not
available on Android Chrome or iOS Safari). WhatsApp and Teams use the native
Android **MediaProjection** API. This repo now ships that native code — wrap the
app with Capacitor and screen sharing works exactly like those apps.

Everything is already wired on the JS side:
`src/lib/native-screen.ts` → used by `src/lib/call.tsx` in `toggleScreenShare()`.
If the native plugin is present, it captures the real screen; otherwise it falls
back to desktop screen share or the rear camera.

## 1. Add Capacitor (run locally, needs Node + Android Studio + JDK 17)

```bash
npm i @capacitor/core
npm i -D @capacitor/cli
npm i @capacitor/android
npx cap add android
```

`capacitor.config.ts` is already in the repo and points at the published site
(`https://quranc1.lovable.app`), so web updates ship without rebuilding the APK.

## 2. Copy the native plugin

```bash
mkdir -p android/app/src/main/java/app/qurancall/screenshare
cp native/android/ScreenSharePlugin.java   android/app/src/main/java/app/qurancall/screenshare/
cp native/android/ScreenCaptureService.java android/app/src/main/java/app/qurancall/screenshare/
```

## 3. Register the plugin

`android/app/src/main/java/app/qurancall/MainActivity.java`:

```java
package app.qurancall;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import app.qurancall.screenshare.ScreenSharePlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(ScreenSharePlugin.class);
    super.onCreate(savedInstanceState);
  }
}
```

## 4. AndroidManifest permissions

In `android/app/src/main/AndroidManifest.xml`, inside `<manifest>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

and inside `<application>`:

```xml
<service
    android:name="app.qurancall.screenshare.ScreenCaptureService"
    android:exported="false"
    android:foregroundServiceType="mediaProjection" />
```

## 5. Mic/camera permission for the WebView

Capacitor's WebView must grant getUserMedia. In the same `MainActivity`, the
Capacitor bridge already handles this when the permissions above are declared —
Android will prompt on the first call.

## 6. Build the APK

```bash
npx cap sync android
cd android && ./gradlew assembleRelease   # or assembleDebug for testing
```

Output: `android/app/build/outputs/apk/release/app-release.apk`
(sign it with your keystore for Play Store).

## What the user sees

1. In a call, taps **Share screen**.
2. Android shows the system "Start recording / casting with QuranCall?" dialog.
3. Whole screen is streamed to the other participant at ~12 fps, with a
   persistent "Your screen is being shared" notification.
4. Tapping **Stop** in the app (or the system) restores the camera.

## iOS note

iOS screen share needs a separate **Broadcast Upload Extension** (ReplayKit) and
an Apple Developer account; it cannot be done from the web layer either. Android
is covered by the code above.
