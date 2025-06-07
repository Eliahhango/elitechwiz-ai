# 🤖 EliTechWiz AI
### *The Ultimate WhatsApp AI Chatbot*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=flat&logo=whatsapp&logoColor=white)](https://whatsapp.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)](https://openai.com/)
[![Anthropic](https://img.shields.io/badge/Anthropic-D4A574?style=flat&logo=anthropic&logoColor=white)](https://anthropic.com/)

*A powerful, production-ready WhatsApp AI chatbot that seamlessly integrates with OpenAI and Anthropic models using the Baileys library.*

[🚀 Quick Deploy](#-one-click-deployment) • [📖 Documentation](#-features) • [🛠️ Setup](#-quick-start) • [💬 Support](#-support)

---

## ⚠️ **Important Legal Notice**

> **This project uses the Baileys library, which is an unofficial WhatsApp Web API client. Using this software might violate WhatsApp's Terms of Service. Use at your own risk and responsibility. This project is intended for educational and personal use only.**

---

## ✨ **Features**

<table>
<tr>
<td width="50%">

### 🤖 **AI-Powered**
- 🧠 **Multiple AI Providers** - OpenAI & Anthropic support
- 💬 **Context-Aware** - Remembers conversation history
- 🎯 **Smart Responses** - Natural, human-like interactions
- 🌍 **Multi-Language** - Responds in user's language

</td>
<td width="50%">

### 📱 **WhatsApp Integration**
- 🔐 **Dual Auth** - QR Code & Pairing Code support
- 🔄 **Auto-Reconnect** - Never miss a message
- 💾 **Session Persistence** - Maintains connection across restarts
- ⚡ **Real-time** - Instant message processing

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ **Developer Friendly**
- 🚀 **One-Click Deploy** - Multiple platform support
- 📊 **Health Monitoring** - Built-in status endpoints
- 📝 **Comprehensive Logging** - Track all interactions
- 🐳 **Docker Ready** - Containerized deployment

</td>
<td width="50%">

### 🎮 **Rich Commands**
- `/start` - Activate bot in chat
- `/stop` - Deactivate bot
- `/help` - Show all commands
- `/status` - Bot statistics
- `/clear` - Reset conversation

</td>
</tr>
</table>

---

## 🚀 **One-Click Deployment**

Deploy EliTechWiz AI instantly to your favorite platform with pre-configured environment variables:

<div align="center">

### 🌟 **Recommended Platforms**

<table>
<tr>
<td align="center" width="25%">
<a href="https://heroku.com/deploy?template=https://github.com/Eliahhango/elitechwiz-ai&env[AI_PROVIDER]=openai&env[AI_MODEL]=gpt-4o&env[USE_PAIRING_CODE]=true">
<img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy to Heroku" height="32">
</a>
<br><strong>Heroku</strong><br>
<em>Free tier available</em>
</td>
<td align="center" width="25%">
<a href="https://railway.app/template/elitechwiz-ai?referralCode=elitechwiz">
<img src="https://railway.app/button.svg" alt="Deploy on Railway" height="32">
</a>
<br><strong>Railway</strong><br>
<em>$5/month</em>
</td>
<td align="center" width="25%">
<a href="https://render.com/deploy?repo=https://github.com/Eliahhango/elitechwiz-ai&name=elitechwiz-ai&env[AI_PROVIDER]=openai&env[AI_MODEL]=gpt-4o&env[USE_PAIRING_CODE]=true">
<img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" height="32">
</a>
<br><strong>Render</strong><br>
<em>Free tier available</em>
</td>
<td align="center" width="25%">
<a href="https://cloud.digitalocean.com/apps/new?repo=https://github.com/Eliahhango/elitechwiz-ai/tree/main&refcode=elitechwiz">
<img src="https://www.deploytodo.com/do-btn-blue.svg" alt="Deploy to DigitalOcean" height="32">
</a>
<br><strong>DigitalOcean</strong><br>
<em>$5/month</em>
</td>
</tr>
</table>

### 🔧 **Additional Platforms**

<table>
<tr>
<td align="center" width="20%">
<a href="https://app.koyeb.com/deploy?type=git&repository=github.com/Eliahhango/elitechwiz-ai&branch=main&name=elitechwiz-ai&env[AI_PROVIDER]=openai&env[AI_MODEL]=gpt-4o&env[USE_PAIRING_CODE]=true">
<img src="https://www.koyeb.com/static/images/deploy/button.svg" alt="Deploy to Koyeb" height="32">
</a>
<br><strong>Koyeb</strong>
</td>
<td align="center" width="20%">
<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FEliahhango%2Felitechwiz-ai&env=OPENAI_API_KEY,AI_PROVIDER,AI_MODEL,USE_PAIRING_CODE&envDescription=API%20keys%20needed%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2FEliahhango%2Felitechwiz-ai%23environment-variables&project-name=elitechwiz-ai&repository-name=elitechwiz-ai">
<img src="https://vercel.com/button" alt="Deploy with Vercel" height="32">
</a>
<br><strong>Vercel</strong>
</td>
<td align="center" width="20%">
<a href="https://app.netlify.com/start/deploy?repository=https://github.com/Eliahhango/elitechwiz-ai&env[AI_PROVIDER]=openai&env[AI_MODEL]=gpt-4o&env[USE_PAIRING_CODE]=true">
<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" height="32">
</a>
<br><strong>Netlify</strong>
</td>
<td align="center" width="20%">
<a href="https://deploy.cloud.run?git_repo=https://github.com/Eliahhango/elitechwiz-ai">
<img src="https://deploy.cloud.run/button.svg" alt="Run on Google Cloud" height="32">
</a>
<br><strong>Google Cloud</strong>
</td>
<td align="center" width="20%">
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FEliahhango%2Felitechwiz-ai%2Fmain%2Fazuredeploy.json">
<img src="https://aka.ms/deploytoazurebutton" alt="Deploy to Azure" height="32">
</a>
<br><strong>Azure</strong>
</td>
</tr>
</table>

</div>

> 💡 **Pro Tip**: After deployment, check your platform's logs to get the pairing code for WhatsApp authentication!

---

## 🛠️ **Quick Start**

### 📋 **Prerequisites**

- 📱 **WhatsApp Account** - Active WhatsApp number
- 🔑 **AI API Key** - [OpenAI](https://platform.openai.com/api-keys) or [Anthropic](https://console.anthropic.com/)
- 💻 **Node.js 18+** - [Download here](https://nodejs.org/)

### ⚡ **Installation**

<details>
<summary><strong>🖥️ Local Development Setup</strong></summary>

\`\`\`bash
# 1️⃣ Clone the repository
git clone https://github.com/Eliahhango/elitechwiz-ai.git
cd elitechwiz-ai

# 2️⃣ Install dependencies
npm install

# 3️⃣ Configure environment
cp .env.example .env

# 4️⃣ Edit .env file with your API keys
nano .env  # or use your preferred editor

# 5️⃣ Start the bot
npm start
\`\`\`

</details>

<details>
<summary><strong>🐳 Docker Setup</strong></summary>

\`\`\`bash
# 1️⃣ Clone and navigate
git clone https://github.com/Eliahhango/elitechwiz-ai.git
cd elitechwiz-ai

# 2️⃣ Create environment file
cp .env.example .env
# Edit .env with your configuration

# 3️⃣ Build and run with Docker
docker build -t elitechwiz-ai .
docker run -d --name elitechwiz-ai \\
  -p 3000:3000 \\
  -v $(pwd)/baileys_auth_info:/app/baileys_auth_info \\
  -v $(pwd)/logs:/app/logs \\
  --env-file .env \\
  elitechwiz-ai

# 4️⃣ Check logs for pairing code
docker logs elitechwiz-ai
\`\`\`

</details>

---

## 🔐 **WhatsApp Authentication**

<div align="center">

### Choose Your Authentication Method

<table>
<tr>
<td width="50%" align="center">

#### 📱 **QR Code Method**
*Quick & Easy*

1. Set `USE_PAIRING_CODE=false`
2. Run the bot
3. Scan QR code with WhatsApp
4. ✅ Connected!

</td>
<td width="50%" align="center">

#### 🔢 **Pairing Code Method**
*Recommended for Deployment*

1. Set `USE_PAIRING_CODE=true`
2. Add your `PHONE_NUMBER`
3. Get 8-digit code from logs
4. Enter in WhatsApp > Linked Devices
5. ✅ Connected!

</td>
</tr>
</table>

</div>

---

## 🎮 **Bot Commands**

<div align="center">

| Command | Description | Example |
|---------|-------------|---------|
| 🟢 `/start` | Activate bot in current chat | Makes bot respond to all messages |
| 🔴 `/stop` | Deactivate bot in current chat | Bot stops responding |
| ❓ `/help` | Show all available commands | Display command list |
| ℹ️ `/about` | Bot information & stats | Version, model, provider info |
| 🗑️ `/clear` | Clear conversation context | Reset chat memory |
| 🏓 `/ping` | Test bot responsiveness | Quick health check |
| 📊 `/status` | Show detailed bot status | Active chats, context size |

</div>

---

## ⚙️ **Configuration**

<details>
<summary><strong>🔧 Environment Variables</strong></summary>

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `production` | ❌ |
| `PORT` | Server port | `3000` | ❌ |
| `USE_PAIRING_CODE` | Use pairing code auth | `false` | ❌ |
| `PHONE_NUMBER` | Phone for pairing code | - | ❌ |
| `AI_PROVIDER` | AI service provider | `openai` | ✅ |
| `AI_MODEL` | AI model to use | `gpt-4o` | ✅ |
| `OPENAI_API_KEY` | OpenAI API key | - | ✅* |
| `ANTHROPIC_API_KEY` | Anthropic API key | - | ✅* |
| `ANTHROPIC_MODEL` | Anthropic model name | `claude-3-sonnet-20240229` | ❌ |
| `SESSION_DIR` | Session storage path | `./baileys_auth_info` | ❌ |
| `LOG_LEVEL` | Logging verbosity | `info` | ❌ |
| `ENABLE_WEBHOOK` | Enable webhook | `false` | ❌ |
| `WEBHOOK_URL` | Webhook URL | - | ❌ |
| `WEBHOOK_SECRET` | Webhook secret | - | ❌ |

*Required based on chosen AI provider

</details>

<details>
<summary><strong>🤖 Supported AI Models</strong></summary>

### OpenAI Models
- `gpt-4o` - Latest GPT-4 Omni (Recommended)
- `gpt-4-turbo` - GPT-4 Turbo
- `gpt-3.5-turbo` - Cost-effective option

### Anthropic Models
- `claude-3-opus-20240229` - Most capable
- `claude-3-sonnet-20240229` - Balanced (Recommended)
- `claude-3-haiku-20240307` - Fastest & cheapest

</details>

---

## 📊 **Platform-Specific Deployment**

<details>
<summary><strong>🟣 Heroku Deployment</strong></summary>

### Automatic Deployment
1. Click the "Deploy to Heroku" button above
2. Fill in the required environment variables
3. Click "Deploy app"
4. Check logs for pairing code: `heroku logs --tail -a your-app-name`

### Manual Deployment
\`\`\`bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key
heroku config:set AI_PROVIDER=openai
heroku config:set USE_PAIRING_CODE=true

# Deploy
git push heroku main

# Check logs
heroku logs --tail
\`\`\`

### Customization Options
- **Dyno Type**: Choose between Eco, Basic, Standard, or Performance dynos
- **Add-ons**: Add PostgreSQL for enhanced storage
- **Auto-scaling**: Configure auto-scaling for high-traffic bots

</details>

<details>
<summary><strong>🚂 Railway Deployment</strong></summary>

### Automatic Deployment
1. Click the "Deploy on Railway" button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy and check logs for pairing code

### Manual Deployment
\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up

# Set environment variables in Railway dashboard
\`\`\`

### Customization Options
- **Instance Size**: Choose between Starter, Developer, or Business plans
- **Persistent Disk**: Add persistent storage for session data
- **Custom Domain**: Configure a custom domain for your bot

</details>

<details>
<summary><strong>▲ Vercel Deployment</strong></summary>

### ▲ Vercel Deployment

**Important**: Vercel has limitations for persistent WhatsApp connections. Consider using other platforms for 24/7 operation.

#### Option 1: Standard Deployment (Recommended for testing)
1. Click the "Deploy with Vercel" button above
2. Import your repository
3. Add environment variables in Vercel dashboard
4. Deploy

#### Option 2: Serverless Functions (Limited functionality)
1. Rename `vercel-serverless.json` to `vercel.json`
2. Use the serverless function approach
3. Note: This has limited WhatsApp connectivity

### Manual Deployment
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
\`\`\`

### Customization Options
- **Framework Preset**: Node.js
- **Build Command**: `npm install`
- **Output Directory**: `.`
- **Development Command**: `npm run dev`

> **Note**: For production use, we recommend Railway, Heroku, or Render for better persistent connection support.

</details>

<details>
<summary><strong>🎨 Render Deployment</strong></summary>

### Automatic Deployment
1. Click the "Deploy to Render" button above
2. Connect your repository
3. Configure environment variables
4. Deploy

### Manual Setup
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `node index.js`
5. Add environment variables

### Customization Options
- **Instance Type**: Choose between Free, Starter, or Standard instances
- **Disk**: Add persistent disk for session storage
- **Auto-Deploy**: Enable automatic deployments on code changes
- **Custom Domain**: Configure a custom domain for your bot

</details>

<details>
<summary><strong>🌊 DigitalOcean Deployment</strong></summary>

### Automatic Deployment
1. Click the "Deploy to DigitalOcean" button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy and check logs for pairing code

### Manual Setup
1. Create a new App on DigitalOcean App Platform
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy

### Customization Options
- **Instance Size**: Choose between Basic, Professional, or Enterprise instances
- **Region**: Select the closest region to your users
- **Auto-Deploy**: Enable automatic deployments on code changes
- **Persistent Storage**: Add volumes for session data

</details>

<details>
<summary><strong>☁️ Google Cloud Run Deployment</strong></summary>

### Automatic Deployment
1. Click the "Run on Google Cloud" button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy

### Manual Setup
1. Create a new Cloud Run service
2. Connect your GitHub repository or container registry
3. Configure environment variables
4. Deploy

### Customization Options
- **CPU and Memory**: Allocate resources based on your needs
- **Autoscaling**: Configure min and max instances
- **Region**: Select the closest region to your users
- **VPC Connector**: Connect to your VPC network

</details>

---

## 🔍 **Monitoring & Logs**

<div align="center">

### 📊 **Health Endpoints**

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `GET /` | Basic status | Bot info & timestamp |
| `GET /health` | Health check | Simple OK response |

### 📝 **Log Files**

| File | Content |
|------|---------|
| `logs/combined.log` | All application logs |
| `logs/error.log` | Error logs only |
| `logs/messages.log` | WhatsApp message history |

</div>

---

## 🛡️ **Security & Best Practices**

<div align="center">

### 🔒 **Security Checklist**

- ✅ **Never commit API keys** to version control
- ✅ **Use environment variables** for sensitive data
- ✅ **Keep session data secure** (`baileys_auth_info` directory)
- ✅ **Monitor API usage** to prevent abuse
- ✅ **Use bot activation commands** to control access
- ✅ **Regular security updates** of dependencies

</div>

---

## 🐛 **Troubleshooting**

<details>
<summary><strong>❌ Common Issues & Solutions</strong></summary>

### 🔐 Authentication Problems
**Issue**: QR code not showing
- **Solution**: Ensure terminal supports QR display or use pairing code method

**Issue**: Pairing code not working
- **Solution**: Verify phone number format includes country code (+1234567890)

### 🌐 Connection Issues
**Issue**: Bot disconnects frequently
- **Solution**: Check internet stability and review error logs

**Issue**: Messages not being received
- **Solution**: Verify bot is activated with `/start` command

### 🤖 AI Response Issues
**Issue**: "API key not found" error
- **Solution**: Verify API key is correctly set in environment variables

**Issue**: Slow responses
- **Solution**: Check API quota and consider switching to faster model

### 🚀 Deployment Issues
**Issue**: App crashes on startup
- **Solution**: Check logs for missing environment variables

**Issue**: Health check failing
- **Solution**: Ensure port is correctly configured for your platform

</details>

---

## 📈 **Performance Optimization**

<details>
<summary><strong>⚡ Optimization Tips</strong></summary>

### 🚀 **Speed Improvements**
- Use `gpt-3.5-turbo` for faster responses
- Limit conversation context size
- Enable response caching
- Use CDN for static assets

### 💰 **Cost Optimization**
- Monitor API usage regularly
- Set usage limits in AI provider dashboard
- Use cheaper models for simple queries
- Implement rate limiting

### 🔧 **Resource Management**
- Regular log rotation
- Session cleanup for inactive chats
- Memory usage monitoring
- Database optimization (if using)

</details>

---

## 🤝 **Contributing**

<div align="center">

We welcome contributions! Here's how you can help:

[![Contributors](https://img.shields.io/github/contributors/Eliahhango/elitechwiz-ai)](https://github.com/Eliahhango/elitechwiz-ai/graphs/contributors)
[![Issues](https://img.shields.io/github/issues/Eliahhango/elitechwiz-ai)](https://github.com/Eliahhango/elitechwiz-ai/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/Eliahhango/elitechwiz-ai)](https://github.com/Eliahhango/elitechwiz-ai/pulls)

</div>

### 🛠️ **Development Setup**

\`\`\`bash
# Fork the repository
git clone https://github.com/Eliahhango/elitechwiz-ai.git
cd elitechwiz-ai

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
\`\`\`

---

## 💬 **Support**

<div align="center">

### 🆘 **Need Help?**

<table>
<tr>
<td align="center" width="25%">
<a href="https://github.com/Eliahhango/elitechwiz-ai/issues">
<img src="https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github" alt="GitHub Issues">
</a>
<br><strong>Bug Reports</strong>
</td>
<td align="center" width="25%">
<a href="https://github.com/Eliahhango/elitechwiz-ai/discussions">
<img src="https://img.shields.io/badge/GitHub-Discussions-blue?style=for-the-badge&logo=github" alt="GitHub Discussions">
</a>
<br><strong>Questions</strong>
</td>
<td align="center" width="25%">
<a href="https://discord.gg/your-discord">
<img src="https://img.shields.io/badge/Discord-Community-purple?style=for-the-badge&logo=discord" alt="Discord">
</a>
<br><strong>Live Chat</strong>
</td>
<td align="center" width="25%">
<a href="mailto:support@elitechwiz.com">
<img src="https://img.shields.io/badge/Email-Support-green?style=for-the-badge&logo=gmail" alt="Email Support">
</a>
<br><strong>Direct Support</strong>
</td>
</tr>
</table>

</div>

---

## 📄 **License**

<div align="center">

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## ⚠️ **Disclaimer**

<div align="center">

> **This project is not affiliated with, authorized by, maintained by, sponsored by, or endorsed by WhatsApp Inc. or any of its affiliates or subsidiaries. This is an independent project that uses unofficial APIs.**

**Use at your own risk and ensure compliance with WhatsApp's Terms of Service.**

</div>

---

<div align="center">

### 🌟 **Star History**

[![Star History Chart](https://api.star-history.com/svg?repos=Eliahhango/elitechwiz-ai&type=Date)](https://star-history.com/#Eliahhango/elitechwiz-ai&Date)

---

**Made with ❤️ by the EliTechWiz Team**

[⬆️ Back to Top](#-elitechwiz-ai)

</div>
\`\`\`

## 10. Let's create an Azure ARM template for deployment:
