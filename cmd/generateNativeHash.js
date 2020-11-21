const yargs = require("yargs");
const hash = require("folder-hash");
const doHash = hash.hashElement;
const { handleResult } = require("../scripts/hashingHelpers");
const {
  makeAndroidGlobPaths,
  makeAndroidStaticPaths,
} = require("../config/android-hash");
const { makeiOSGlobPaths, makeiOSStaticPaths } = require("../config/ios-hash");
const writeFile = require("../scripts/writeFile");

// Define command line flags
const argv = yargs
  .option("platform", {
    alias: "p",
    description: "The deployment platform",
    type: "string",
  })
  .option("outputFile", {
    alias: "o",
    description: "The file path to write the log of files + hashes",
    type: "string",
  })
  .demandOption(["platform", "outputFile"])
  .help().argv;

const { platform, outputFile } = argv;

const projectRoot = ".";
const platformRoot = `${projectRoot}/${platform}`;

const globs = {
  ios: makeiOSGlobPaths({ platformRoot, projectRoot }),
  android: makeAndroidGlobPaths({ platformRoot, projectRoot }),
};

const staticDeps = {
  ios: makeiOSStaticPaths({ platformRoot, projectRoot }),
  android: makeAndroidStaticPaths({ platformRoot, projectRoot }),
};

const envFiles = [".env", ".env.uat", ".env.prod", ".env.test"].map(
  (f) => `${projectRoot}/${f}`
);

const hashGlobs = async ({ root, exts }) => {
  const options = {
    files: { include: exts },
  };
  try {
    return handleResult(await doHash(root, options));
  } catch (e) {
    throw new Error("hashing failed:", e);
  }
};

const hashStatic = async (items) => {
  try {
    return await Promise.all(
      items.map(async (f) => {
        return handleResult(await doHash(f));
      })
    );
  } catch (e) {
    throw new Error("hashing failed:", e);
  }
};

(async function () {
  const result = await Promise.all([
    hashGlobs(globs[platform]),
    hashStatic([...staticDeps[platform], ...envFiles]),
  ]);
  await writeFile(outputFile, result.flat(Infinity).sort().join("\n"));
})();
