# Creating a Release Build for Google Play

Google Play **requires** Android App Bundle (AAB) for new apps. You can still build an APK for testing; both flows use the same release keystore.

---

## 1. Create a release keystore (one-time)

Run this in a terminal. **Keep the keystore and passwords safe** — you need them for all future updates.

### Windows (keytool not in PATH)

`keytool` is in the Java JDK. Use the full path or add it to PATH:

```powershell
cd android
& "C:\Program Files\Java\jdk-17\bin\keytool.exe" -genkeypair -v -storetype PKCS12 -keystore app\release.keystore -alias jainapp -keyalg RSA -keysize 2048 -validity 10000 -storepass YOUR_STORE_PASSWORD -keypass YOUR_KEY_PASSWORD -dname "CN=JainApp, OU=Mobile, O=Jainsansaar, L=City, ST=State, C=US"
```

Replace `YOUR_STORE_PASSWORD` and `YOUR_KEY_PASSWORD` with your chosen passwords, then put the **same** values in `keystore.properties` (Step 2).

Or run without `-storepass`/`-keypass` to be prompted for them:

```powershell
& "C:\Program Files\Java\jdk-17\bin\keytool.exe" -genkeypair -v -storetype PKCS12 -keystore app\release.keystore -alias jainapp -keyalg RSA -keysize 2048 -validity 10000
```

If you have JDK 11 instead: use `jdk-11` in the path.

- **PKCS12 keystore**: store and key passwords must be the same. Use identical values for `storePassword` and `keyPassword` in `keystore.properties`.
- Store location: `android\app\release.keystore`
- The `release.keystore` file is already gitignored; do not commit it.

---

## 2. Create `keystore.properties` (one-time)

In the **`android`** folder (same level as `app/` and `build.gradle`), create `keystore.properties`:

**Path:** `android/keystore.properties`

```properties
storeFile=app/release.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=jainapp
keyPassword=YOUR_KEY_PASSWORD
```

- Replace `YOUR_KEYSTORE_PASSWORD` and `YOUR_KEY_PASSWORD` with the values you set when creating the keystore.
- This file is gitignored; do not commit it.

---

## 3. Build for Google Play

### Option A: Android App Bundle (AAB) — required for Play Store

From project root:

```powershell
cd android
.\gradlew.bat bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

Upload this file in [Google Play Console](https://play.google.com/console) → Your app → Release → Production (or testing track) → Create new release → Upload.

### Option B: Release APK (for sideload or other stores)

From project root:

```powershell
npm run build:apk:win
```

Or:

```powershell
cd android
.\gradlew.bat assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## 4. Version for each new release

In `android/app/build.gradle`, update before each store upload:

- **versionCode** — integer, must increase every release (e.g. 1, 2, 3).
- **versionName** — user-visible version (e.g. `"1.0"`, `"1.1"`).

```gradle
defaultConfig {
    versionCode 2
    versionName "1.1"
    // ...
}
```

---

## Checklist before uploading to Google Play

- [ ] Release keystore created and stored safely.
- [ ] `keystore.properties` created in `android/` and not committed.
- [ ] Built AAB with `.\gradlew.bat bundleRelease`.
- [ ] `versionCode` and `versionName` updated for this release.
- [ ] App tested in release mode (e.g. `.\gradlew.bat installRelease` on a device).

---

## Troubleshooting

- **“Keystore was tampered with or password incorrect”**  
  Double-check `storePassword` and `keyPassword` in `keystore.properties` and that `storeFile` path is correct (relative to `android/`).

- **"keytool is not recognized" (Windows)** — Use the full path: `& "C:\Program Files\Java\jdk-17\bin\keytool.exe"` (or `jdk-11` if that's what you have).

- **"Given final block not properly padded" / "bad key used during decryption"** — The keystore file is corrupt or was created with different passwords. Delete `android/app/release.keystore`, then regenerate it (Step 1). Ensure the passwords in `keystore.properties` match exactly what you used when creating the keystore.

- **“Release build uses debug signing”**  
  Ensure `keystore.properties` exists in `android/` and that `signingConfig signingConfigs.release` is set for the `release` build type in `app/build.gradle`.

- **Build fails with “release” signing**  
  Confirm the path in `storeFile` points to your keystore (e.g. `app/release.keystore` if the keystore is in `android/app/`).
