const { mkdirSync } = require("fs");
const { argv } = require("process");
const { execFile, spawnSync } = require("child_process");
const { join } = require("path");

const SITE_ID = argv[2];
const REPO_URL = argv[3];
const BUILD_COMMAND = argv[4];
const DEPLOY_DIR = join(process.env.SITES_DIR, SITE_ID);
const OUTPUT_DIR = join(
  __dirname,
  SITE_ID +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 8)
);

const removeDir = path => spawnSync("rm", ["-rf", path]);

const finish = () => {
  removeDir(OUTPUT_DIR);
  process.exit(0);
};

const main = async () => {
  mkdirSync(OUTPUT_DIR);

  //ToDo Make sure undefined is not passed as BUILD_COMMAND
  const build = execFile(__dirname + "/build.sh", [REPO_URL, BUILD_COMMAND], {
    cwd: OUTPUT_DIR,
    shell: true,
    env: {
      DEPLOY_DIR
    }
  });

  // Use this for streaming build output to frontend.
  // build.stdout.on("data", data => console.log(data));

  build.on("error", error => {
    process.send({ error });
    finish();
  });

  build.on("close", () => {
    finish();
  });

  process.on("message", msg => {
    if (msg === "stop") {
      build.kill();
      finish();
    }
  });

  process.on("exit", code => {
    build.kill(code);
    finish();
  });
};

main();
