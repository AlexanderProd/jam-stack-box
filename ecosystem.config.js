module.exports = {
  apps: [
    {
      name: "JAMStackBox",
      script: "server/dist/index.js",

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        PORT: 3000,
        NODE_ENV: "development",
        SECRET: "yHSHGuYkD4YMryOU1mJUId4zUihMNg",
        PASSWORD: "admin",
      },
      env_production: {
        PORT: 6469,
        NODE_ENV: "production",
        SECRET: "yHSHGuYkD4YMryOU1mJUId4zUihMNg",
        PASSWORD: "admin",
      },
    },
  ],
};
