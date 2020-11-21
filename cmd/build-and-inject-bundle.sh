#! /bin/bash

VERSION="1.0.0"
BUILD_NUMBER=1.0.0
APP_NAME="YourApp"
PACKAGED_APP="path/to/previously/built/ipa"
BUILD_DIR="path/to/build/output"
MAIN_BUNDLE="path/to/bundle.js"
ASSETS="path/to/output/assets"
ENTRY_FILE="path/to/app/entry/index.js"

# Generate a new JS bundle.
yarn run react-native bundle \
  --entry-file "$ENTRY_FILE" \
  --platform ios \
  --reset-cache \
  --dev false \
  --bundle-output "$MAIN_BUNDLE" \
  --assets-dest "$BUILD_DIR"

# Unzip the ipa and replace the bundle + assets in the current app with the new one.
unzip -o -q "$PACKAGED_APP" -d "$BUILD_DIR"
EXTRACTED_APP="$BUILD_DIR/Payload/$APP_NAME.app"
# Verify the code signature is valid.
codesign -v "$EXTRACTED_APP" 
cp "$MAIN_BUNDLE" "$EXTRACTED_APP/"
cp -r "$ASSETS" "$EXTRACTED_APP/"
rm $MAIN_BUNDLE
rm -rf "$ASSETS"

# Update the app version
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION" "$EXTRACTED_APP/Info.plist"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "$EXTRACTED_APP/Info.plist"

# Update the app version visible in the settings
/usr/libexec/PlistBuddy \
  -c "Set PreferenceSpecifiers:1:DefaultValue $VERSION" \
  "$EXTRACTED_APP/Settings.bundle/Root.plist"

# Create the new ipa.
cd $BUILD_DIR
zip -q -r "$PACKAGED_APP" .

# Resign the new ipa.
cd $IOS_ROOT
IPA_PATH="$PACKAGED_APP" bundle exec fastlane "resign_${CERT_TYPE}_$IOS_STAGE"
unzip -o -q "$PACKAGED_APP" -d "$BUILD_DIR"
# Verify the code signature is still valid
codesign -v "$EXTRACTED_APP"
