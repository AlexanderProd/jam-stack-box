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
      log_date_format: "HH:mm:ss DD-MM-YY",
    },
  ],
};
