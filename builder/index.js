const { mkdirSync } = require("fs");
const { argv } = require("process");
const { execFile, spawn } = require("child_process");
const { join } = require("path");

const removeDir = path => spawn("rm", ["-rf", path]);

const main = async () => {
  const SITE_ID = argv[2];
  const REPO_URL = argv[3];
  const BUILD_COMMAND = argv[4];
  const OUTPUT_DIR = argv[5];

  const siteDirectory = join(
    __dirname,
    SITE_ID +
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 8)
  );

  mkdirSync(siteDirectory);

  //ToDo Make sure undefined is not passed as BUILD_COMMAND
  const build = execFile(__dirname + "/build.sh", [REPO_URL, BUILD_COMMAND], {
    cwd: siteDirectory,
    shell: true
  });

  // Use this for streaming build output to frontend.
  // build.stdout.on("data", data => console.log(data));
  build.on("error", err => console.error(err));
  build.on("close", code => {
    if (code === 0) {
      process.send("sucess");
      removeDir(siteDirectory);
    }
  });

  process.on("message", msg => {
    if (msg === "stop") {
      build.kill();
      removeDir(siteDirectory);
      process.exit();
    }
  });
};

main();
