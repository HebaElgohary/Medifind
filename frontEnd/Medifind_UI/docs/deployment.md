# Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the MediFind application to various environments, including development, staging, and production.

## Prerequisites

### Required Tools
- Node.js (version 16 or higher)
- npm (version 7 or higher)
- Git
- Docker (optional)
- CI/CD tools (optional)

### Required Accounts
- Hosting provider account
- Domain name
- SSL certificate
- Database service

## Environment Setup

### Development Environment
1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Start development server

```bash
git clone https://github.com/your-username/medifind-ui.git
cd medifind-ui
npm install
cp .env.example .env
npm run dev
```

### Staging Environment
1. Set up staging server
2. Configure staging environment
3. Deploy application
4. Run tests

```bash
# On staging server
git clone -b staging https://github.com/your-username/medifind-ui.git
cd medifind-ui
npm install
npm run build
npm run start
```

### Production Environment
1. Set up production server
2. Configure production environment
3. Deploy application
4. Monitor deployment

```bash
# On production server
git clone -b main https://github.com/your-username/medifind-ui.git
cd medifind-ui
npm install --production
npm run build
npm run start
```

## Build Process

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build:prod
```

### Build Configuration
```javascript
// vite.config.js
export default {
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'moment']
        }
      }
    }
  }
}
```

## Server Configuration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name medifind.example.com;
    
    location / {
        root /var/www/medifind-ui/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName medifind.example.com
    DocumentRoot /var/www/medifind-ui/dist
    
    <Directory /var/www/medifind-ui/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ProxyPass /api http://localhost:3000
    ProxyPassReverse /api http://localhost:3000
</VirtualHost>
```

## Database Setup

### MongoDB Setup
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB service
sudo service mongodb start

# Create database and user
mongo
> use medifind
> db.createUser({
    user: "medifind_user",
    pwd: "password",
    roles: ["readWrite"]
  })
```

### Environment Variables
```env
MONGODB_URI=mongodb://medifind_user:password@localhost:27017/medifind
MONGODB_DB=medifind
```

## SSL Configuration

### Let's Encrypt
```bash
# Install Certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --nginx -d medifind.example.com

# Auto-renewal
sudo certbot renew --dry-run
```

### SSL Configuration
```nginx
server {
    listen 443 ssl;
    server_name medifind.example.com;
    
    ssl_certificate /etc/letsencrypt/live/medifind.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/medifind.example.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
}
```

## Monitoring Setup

### Application Monitoring
```bash
# Install PM2
npm install -g pm2

# Start application with PM2
pm2 start npm --name "medifind" -- start

# Monitor application
pm2 monit
```

### Logging Configuration
```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## Backup and Recovery

### Database Backup
```bash
# Create backup
mongodump --db medifind --out /backup/medifind-$(date +%Y%m%d)

# Restore backup
mongorestore --db medifind /backup/medifind-20240101/medifind
```

### Application Backup
```bash
# Backup application files
tar -czf medifind-backup-$(date +%Y%m%d).tar.gz /var/www/medifind-ui

# Restore application
tar -xzf medifind-backup-20240101.tar.gz -C /var/www/medifind-ui
```

## Scaling

### Horizontal Scaling
1. Set up load balancer
2. Configure multiple instances
3. Set up session sharing
4. Configure database replication

### Vertical Scaling
1. Increase server resources
2. Optimize application
3. Configure caching
4. Monitor performance

## CI/CD Pipeline

### GitHub Actions
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, staging ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy
        run: |
          echo "Deploying to production..."
          # Add deployment steps here
```

## Troubleshooting

### Common Issues
1. Build failures
2. Deployment errors
3. Database connection issues
4. Performance problems

### Debugging Tools
1. Application logs
2. Server logs
3. Network monitoring
4. Performance profiling

## Maintenance

### Regular Tasks
1. Update dependencies
2. Backup data
3. Monitor performance
4. Security updates

### Update Procedure
1. Pull latest changes
2. Update dependencies
3. Run tests
4. Deploy updates
5. Verify deployment

## Rollback Procedure

### Application Rollback
```bash
# Switch to previous version
git checkout <previous-commit-hash>
npm install
npm run build
pm2 restart medifind
```

### Database Rollback
```bash
# Restore previous backup
mongorestore --db medifind /backup/medifind-previous/medifind
```

## Security Considerations

### Production Security
1. Enable HTTPS
2. Configure firewalls
3. Set up monitoring
4. Regular security audits

### Access Control
1. Restrict server access
2. Use strong passwords
3. Implement 2FA
4. Regular access reviews 