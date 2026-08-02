# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

# React Native PDF - PDFBox
-keep class com.tom_roush.pdfbox.** { *; }
-keep class org.apache.pdfbox.** { *; }
-dontwarn com.gemalto.jp2.JP2Decoder
-dontwarn org.bouncycastle.**
-dontwarn org.apache.commons.logging.**

# Suppress warnings for missing classes referenced by PDFBox
-dontwarn com.gemalto.jp2.**
-dontwarn org.apache.fontbox.**
-dontwarn org.apache.xmpbox.**

# react-native-pdf -> io.legere.pdfiumandroid was compiled against a newer kotlin-stdlib that
# has this coroutines-internal spilling helper; the version resolved here does not ship it.
# It is only referenced by compiler-generated code that never runs, so R8 can ignore it.
# (Matches app/build/outputs/mapping/release/missing_rules.txt.)
-dontwarn kotlin.coroutines.jvm.internal.SpillingKt

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# React Native Maps
-keep class com.airbnb.android.react.maps.** { *; }
-keep class com.google.android.gms.maps.** { *; }
-keep class com.google.android.gms.location.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Firebase / FCM / React Native Firebase (release minify)
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**
-keep class io.invertase.firebase.** { *; }
-keep class io.invertase.notifee.** { *; }

# Play Install Referrer: Firebase Analytics looks this up reflectively
# (InstallReferrerClient.newBuilder(Context)) to attribute installs. Obfuscating it does not
# crash - the lookup is caught - but it silently logs
# `java.lang.NoSuchMethodException: k3.a.newBuilder` and install attribution stops working.
-keep class com.android.installreferrer.api.** { *; }
