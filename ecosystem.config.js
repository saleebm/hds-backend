module.exports = {
  apps: [
    {
      name: 'hds',
      script: 'npm',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: 'run production',
      // instances: 'max',
      // exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      // max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './err.log',
      out_file: './out.log',
      log_file: './combined.log',
      time: true,
    },
  ],
}
