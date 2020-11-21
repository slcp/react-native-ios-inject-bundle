// projectRoot is the root path of the repo
// platformRoot is the root path of the platform folder in the repo

const makeiOSStaticPaths = ({platformRoot, appName = "YourApp"}) =>
    ['Podfile.lock', 'LaunchScreen.storyboard', `${appName}/Images.xcassets`, `${appName}.xcworkspace`, `${appName}.xcodeproj`].map(f => `${platformRoot}/${f}`);

const makeiOSGlobPaths = ({ platformRoot, appName = "YourApp" }) => ({
  root: `${platformRoot}/${appName}`,
  exts: [
    "*.h",
    "*.m",
    "*.xcconfig",
    "*.json",
    "*.swift",
    "*.plist",
    "*.entitlements",
    "*.storyboard",
    "*.lock",
  ],
});

module.exports = {
    makeiOSStaticPaths,
    makeiOSGlobPaths
}
