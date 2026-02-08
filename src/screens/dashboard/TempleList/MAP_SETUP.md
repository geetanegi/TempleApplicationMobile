# Google Maps – Temple Locator Setup

The Temple Locator screen uses **Google Maps** and **device location**. You need to install dependencies and add API keys.

---

## 1. Install dependencies

From the project root:

```bash
npm install
```

The following were added to `package.json`:

- **react-native-maps** – map view and markers
- **@react-native-community/geolocation** – current location

Then:

- **Android:** no extra step (manifest already has the Maps meta-data placeholder).
- **iOS:** run `cd ios && pod install && cd ..`.

---

## 2. Google Maps API key

### Get an API key

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project or select an existing one.
3. Enable **Maps SDK for Android** and **Maps SDK for iOS**:
   - APIs & Services → Library → search “Maps SDK for Android” / “Maps SDK for iOS” → Enable.
4. Create credentials:
   - APIs & Services → Credentials → Create credentials → API key.
5. (Recommended) Restrict the key:
   - By app: restrict to your Android package name / iOS bundle ID.
   - By API: allow only “Maps SDK for Android” and “Maps SDK for iOS”.

### Android

1. Open `android/app/src/main/AndroidManifest.xml`.
2. Find the meta-data with `com.google.android.geo.API_KEY`.
3. Replace `YOUR_GOOGLE_MAPS_ANDROID_API_KEY` with your **Android** API key:

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_ACTUAL_ANDROID_API_KEY"/>
```

### iOS

1. Open `ios/YourAppName/AppDelegate.mm` (or `.m`).
2. Add at the top (with other imports):

```objc
#import <GoogleMaps/GoogleMaps.h>
```

3. In the `application:didFinishLaunchingWithOptions:` method, **before** `return YES;`, add:

```objc
[GMSServices provideAPIKey:@"YOUR_IOS_API_KEY"];
```

4. Run `pod install` in the `ios` folder (if you use CocoaPods for Google Maps).

If you use a separate config (e.g. `Secrets.xcconfig`), put the key there and reference it in the build settings instead of hardcoding.

---

## 3. Location permission

- **Android:** `ACCESS_FINE_LOCATION` is already in `AndroidManifest.xml`. The app requests permission when the Temple Locator screen opens.
- **iOS:** Add to `Info.plist`:
  - **NSLocationWhenInUseUsageDescription** (e.g. “Temple Locator uses your location to show nearby temples and your position on the map.”).

---

## 4. Summary

| Requirement              | Android | iOS |
|--------------------------|--------|-----|
| Maps SDK enabled         | Yes    | Yes |
| API key in project       | AndroidManifest meta-data | AppDelegate (or config) |
| Location permission      | In manifest + runtime request | Info.plist + runtime |
| Extra dependencies       | None   | `pod install` |

Without a valid API key, the map may show a blank or error state. Replace the placeholders with your keys and rebuild the app.
