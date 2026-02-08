# Building Android APK

## Quick build (release APK)

### On Mac / Linux / WSL
```bash
npm run build:apk
```

### On Windows (PowerShell or CMD)
```bash
npm run build:apk:win
```

Or manually:
```bash
cd android
gradlew.bat assembleRelease
```

---

## Output

The release APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

Install on a device:
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## Prerequisites

1. **Node & npm** – dependencies installed (`npm install`)
2. **JDK 17** – required for React Native 0.74 (set `JAVA_HOME` if needed)
3. **Android SDK** – installed via [Android Studio](https://developer.android.com/studio) or command-line tools

---

## Optional: signed APK for Play Store

Your current release build uses the **debug keystore** (fine for testing). For Google Play you need a **release keystore**:

1. **Create a keystore** (once, keep it safe):
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing** in `android/app/build.gradle`:
   - Add a `release` block under `signingConfigs` that points to your keystore file and passwords.
   - Set `signingConfig signingConfigs.release` in the `release` buildType (instead of `signingConfigs.debug`).

3. **Store secrets safely** – put keystore path and passwords in `android/gradle.properties` (and add that file to `.gitignore`) or use environment variables.

See: [React Native – Signed APK (Android)](https://reactnative.dev/docs/signed-apk-android)
