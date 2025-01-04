module.exports = {
  apps: [{
    name: 'onboarding-service',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/onboarding/pm2_error.log',
    out_file: '/var/log/onboarding/pm2_out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Monitoring configuration
    monitoring: true,
    instance_var: 'INSTANCE_ID',
    
    // Metrics
    metrics: {
      http: true,
      custom_metrics: [{
        id: 'onboarding_completions',
        name: 'Onboarding Completions',
        type: 'counter'
      }]
    },
    
    // Restart on resource limits
    max_restarts: 10,
    min_uptime: '5s',
    
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 3000,
  }]
};
