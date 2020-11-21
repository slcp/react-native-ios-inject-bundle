// projectRoot is the root path of the repo
// platformRoot is the root path of the platform folder in the repo

const makeAndroidAssetPaths = ({platformRoot}) => ['main', 'prod', 'uat'].map(stage => `${platformRoot}/app/src/${stage}/assets`)
const makePlatformRootStaticPaths = ({platformRoot}) => ['Gemfile.lock', 'build.gradle', 'gradle.properties', 'settings.gradle'].map(f => `${platformRoot}/${f}`)
const makeProjectRootStaticPaths = ({projectRoot}) => ['yarn.lock'].map(f => `${projectRoot}/${f}`)

const makeAndroidStaticPaths = ({projectRoot, platformRoot}) =>
    [
        ...makeAndroidAssetPaths({platformRoot}),
        ...makePlatformRootStaticPaths({platformRoot}),
        ...makeProjectRootStaticPaths({projectRoot})
    ];

const makeAndroidGlobPaths = ({platformRoot}) => ({
    root: `${platformRoot}/app`,
    exts: ['*.gradle', '*.java', '*.properties', '*.pro', '*.xml', '*.png', '*.json', '*.lock']
})

module.exports = {
    makeAndroidStaticPaths,
    makeAndroidGlobPaths
}
