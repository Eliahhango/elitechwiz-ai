# EliTechWiz AI - Multi-Platform Deployment Guide

## 🚀 Quick Start

1. **Fork the Repository**
   \`\`\`bash
   # Go to: https://github.com/Eliahhango/elitechwiz-ai
   # Click "Fork" button
   \`\`\`

2. **Set Environment Variables**
   - `OPENAI_API_KEY`: Your OpenAI API key (required)
   - `PHONE_NUMBER`: Your WhatsApp number (optional)
   - `BOT_NAME`: Custom bot name (optional)

3. **Deploy to Your Platform**
   - Choose from: Vercel, Netlify, Railway, Render, Heroku

## 📋 Platform-Specific Instructions

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository

2. **Configure Environment Variables**
   \`\`\`
   OPENAI_API_KEY=sk-your-key-here
   PHONE_NUMBER=1234567890
   BOT_NAME=Your Bot Name
   \`\`\`

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Visit your deployment URL

### Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your forked repository

2. **Build Settings**
   \`\`\`
   Build command: npm run build
   Publish directory: public
   \`\`\`

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add your variables

### Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Deploy from GitHub repo

2. **Environment Variables**
   - Add variables in the Variables tab

### Render

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New Web Service"
   - Connect your repository

2. **Settings**
   \`\`\`
   Build Command: npm install
   Start Command: npm start
   \`\`\`

### Heroku

1. **Create App**
   \`\`\`bash
   heroku create your-app-name
   \`\`\`

2. **Set Environment Variables**
   \`\`\`bash
   heroku config:set OPENAI_API_KEY=sk-your-key-here
   \`\`\`

3. **Deploy**
   \`\`\`bash
   git push heroku main
   \`\`\`

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **OpenAI API Key**: Get one from [platform.openai.com](https://platform.openai.com)
3. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket

## Environment Variables

Set these environment variables in your Vercel dashboard:

### Required
- `OPENAI_API_KEY`: Your OpenAI API key (starts with 'sk-')

### Optional but Recommended
- `PHONE_NUMBER`: Your WhatsApp phone number (with country code)
- `BOT_NAME`: Custom name for your bot (default: "EliTechWiz AI")
- `OWNER_NUMBER`: WhatsApp number of the bot owner
- `ENCRYPTION_KEY`: Custom encryption key for secure config storage
- `ANTHROPIC_API_KEY`: Anthropic API key (if using Claude)
- `AI_PROVIDER`: AI provider to use (default: "openai")
- `AI_MODEL`: AI model to use (default: "gpt-4o")
- `BOT_MODE`: Bot mode - "private" or "public" (default: "private")
- `LOG_LEVEL`: Logging level - "debug", "info", "warn", "error" (default: "info")

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository has the correct structure:
\`\`\`
├── api/
│   ├── index.js
│   ├── config.js
│   └── whatsapp.js
├── public/
│   ├── index.html
│   ├── setup.html
│   ├── config.html
│   └── connect.html
├── package.json
├── vercel.json
└── README.md
\`\`\`

### 2. Deploy to Vercel

#### Option A: Vercel CLI
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
\`\`\`

#### Option B: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure environment variables
5. Deploy

### 3. Configure Environment Variables

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the required variables listed above
4. Redeploy if necessary

### 4. Test Your Deployment

1. Visit your deployed URL
2. You should see the setup wizard on first visit
3. Configure your bot settings
4. Test the WhatsApp connection

## 🔧 Verification

After deployment, your app will automatically:

1. **Check Fork Status**
   - Verify you've forked the repository
   - Display setup instructions if not forked

2. **Health Monitoring**
   - Monitor system status
   - Check API connectivity
   - Validate configuration

3. **Error Handling**
   - Display helpful error messages
   - Provide troubleshooting guidance
   - Graceful fallbacks

## 🛠️ Troubleshooting

### White Screen Issues

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify Environment Variables**
   - Ensure OPENAI_API_KEY is set
   - Check variable names are correct

3. **Check Deployment Logs**
   - Review build logs for errors
   - Check function execution logs

### Fork Verification Issues

1. **Manual Override**
   - Add `?skip=true` to URL for testing
   - Check deployment environment variables

2. **Local Development**
   - Fork verification is bypassed on localhost
   - Use `npm run dev` for local testing

### API Errors

1. **Check API Keys**
   - Verify OpenAI API key is valid
   - Ensure sufficient credits

2. **Network Issues**
   - Check CORS configuration
   - Verify API endpoints are accessible

### Common Issues

#### 1. "Module not found" errors
- Ensure all imports use the correct file extensions (.js)
- Check that all files are properly committed to your repository

#### 2. "Function timeout" errors
- WhatsApp connections may take time to establish
- Consider increasing function timeout in vercel.json

#### 3. "Environment variable not found"
- Double-check variable names in Vercel dashboard
- Ensure variables are set for the correct environment (production)

#### 4. "API key invalid" errors
- Verify your OpenAI API key is correct
- Check that the key has sufficient credits/permissions

### Debug Mode

To enable debug logging:
1. Set `LOG_LEVEL=debug` in environment variables
2. Check function logs in Vercel dashboard

## 📱 Post-Deployment

1. **Visit Your App**
   - Go to your deployment URL
   - Complete the setup wizard

2. **Configure Bot**
   - Set bot name and mode
   - Configure AI provider
   - Set up WhatsApp connection

3. **Test Functionality**
   - Check health endpoint: `/health`
   - Test configuration: `/config`
   - Verify WhatsApp connection: `/connect`

## 🔒 Security

1. **Environment Variables**
   - Never commit API keys to repository
   - Use platform-specific environment variable storage

2. **Access Control**
   - Fork verification prevents unauthorized use
   - Configure bot mode appropriately

3. **Monitoring**
   - Monitor deployment logs
   - Set up error alerts
   - Regular security updates

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review deployment logs
3. Verify environment variables
4. Test locally first
5. Open an issue on GitHub

## 🎯 Best Practices

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor for security patches

2. **Monitoring**
   - Set up uptime monitoring
   - Monitor API usage and costs

3. **Backup**
   - Regular configuration backups
   - Document custom settings

4. **Testing**
   - Test in development first
   - Use staging environment for major changes

## 🌟 Advanced Features

### Custom Domain Setup

1. **Vercel Custom Domain**
   \`\`\`bash
   # Add domain in Vercel dashboard
   # Update DNS records as instructed
   # SSL certificate is automatically provisioned
   \`\`\`

2. **Netlify Custom Domain**
   \`\`\`bash
   # Go to Domain settings
   # Add custom domain
   # Configure DNS records
   \`\`\`

### Environment-Specific Configuration

\`\`\`javascript
// Example environment configuration
const config = {
  development: {
    logLevel: 'debug',
    aiProvider: 'openai',
    aiModel: 'gpt-3.5-turbo'
  },
  production: {
    logLevel: 'info',
    aiProvider: 'openai',
    aiModel: 'gpt-4o'
  }
}
\`\`\`

### Monitoring and Analytics

1. **Health Monitoring**
   \`\`\`bash
   # Set up uptime monitoring
   curl https://your-app.vercel.app/health
   \`\`\`

2. **Error Tracking**
   - Configure error reporting
   - Set up alert notifications
   - Monitor API usage patterns

### Scaling Considerations

1. **Function Limits**
   - Vercel: 10s execution time (Hobby), 60s (Pro)
   - Netlify: 10s (Free), 26s (Pro)
   - Railway: No specific limits
   - Render: 30s timeout

2. **Memory Optimization**
   \`\`\`javascript
   // Optimize memory usage
   const config = {
     maxContextLength: 5, // Reduce for lower memory
     cacheSize: 100,      // Limit cache size
     logLevel: 'warn'     // Reduce logging
   }
   \`\`\`

## 🔄 Continuous Integration

### GitHub Actions (Optional)

\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run verify
      - run: npm run deploy
\`\`\`

### Automated Testing

\`\`\`javascript
// scripts/test-deployment.js
async function testDeployment() {
  const tests = [
    { name: 'Health Check', url: '/health' },
    { name: 'Fork Verification', url: '/verify' },
    { name: 'Config API', url: '/api/config' }
  ];
  
  for (const test of tests) {
    try {
      const response = await fetch(baseUrl + test.url);
      console.log(`✅ ${test.name}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${test.name}: Failed`);
    }
  }
}
\`\`\`

## 📊 Performance Optimization

### Caching Strategy

\`\`\`javascript
// Implement caching for better performance
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedResponse(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}
\`\`\`

### Resource Optimization

1. **Static Assets**
   - Use CDN for static files
   - Implement proper caching headers
   - Optimize images and fonts

2. **API Optimization**
   - Implement request debouncing
   - Use connection pooling
   - Optimize database queries

## 🎨 Customization

### Theming

\`\`\`css
/* Custom theme variables */
:root {
  --primary-color: #your-color;
  --secondary-color: #your-secondary;
  --font-family: 'Your-Font', sans-serif;
}
\`\`\`

### Custom Commands

\`\`\`javascript
// Add custom bot commands
const customCommands = {
  '/weather': async (location) => {
    // Implement weather API integration
    return `Weather in ${location}: ...`;
  },
  '/translate': async (text, lang) => {
    // Implement translation service
    return `Translated: ${text}`;
  }
};
\`\`\`

## 🔐 Security Hardening

### API Security

\`\`\`javascript
// Implement rate limiting
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
};
\`\`\`

### Input Validation

\`\`\`javascript
// Validate user inputs
function validateInput(input) {
  const sanitized = input.trim().slice(0, 1000);
  const hasValidChars = /^[a-zA-Z0-9\s\-_.,!?]+$/.test(sanitized);
  return hasValidChars ? sanitized : null;
}
\`\`\`

## 📈 Monitoring Dashboard

### Key Metrics

1. **System Health**
   - API response times
   - Error rates
   - Memory usage
   - Function execution time

2. **Business Metrics**
   - Active users
   - Message volume
   - AI API usage
   - Cost tracking

### Alerting

\`\`\`javascript
// Set up monitoring alerts
const alerts = {
  errorRate: { threshold: 5, period: '5m' },
  responseTime: { threshold: 2000, period: '1m' },
  memoryUsage: { threshold: 80, period: '5m' }
};
\`\`\`

This comprehensive deployment solution ensures your EliTechWiz AI bot is properly deployed, monitored, and maintained across multiple platforms with robust error handling and fork verification.
