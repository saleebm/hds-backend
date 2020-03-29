module.exports = {
  apps: [
    {
      name: 'hds',
      script: 'npm',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: 'run production',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      error_file: 'err.log',
      out_file: 'out.log',
      log_file: 'combined.log',
      time: true
    },
  ],

  deploy: {
    production: {
      user: 'minasaleeb',
      host: '34.69.241.58',
      ref: 'origin/master',
      repo: 'git@github.com:saleebm/hds-backend.git',
      path: '/var/www/html/imputed.tech',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
}
