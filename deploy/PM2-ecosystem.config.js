module.exports = {
  apps: [
    {
      name: 'stroybrands-api',
      cwd: '/app/apps/api',
      script: 'dist/main.js',
      instances: process.env.PM2_API_INSTANCES || 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'stroybrands-web',
      cwd: '/app/apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
