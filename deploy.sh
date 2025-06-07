#!/bin/bash

# EliTechWiz AI Deployment Script
# Usage: ./deploy.sh [platform]

set -e

echo "🚀 EliTechWiz AI Deployment Script"
echo "=================================="

# Check if platform is specified
PLATFORM=${1:-""}

if [ -z "$PLATFORM" ]; then
    echo "Please specify a deployment platform:"
    echo "  ./deploy.sh heroku"
    echo "  ./deploy.sh railway"
    echo "  ./deploy.sh docker"
    echo "  ./deploy.sh local"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Creating from template..."
    cp .env.example .env
    echo "✅ Please edit .env file with your configuration and run again."
    exit 1
fi

case $PLATFORM in
    "heroku")
        echo "🟣 Deploying to Heroku..."
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI not found. Please install it first."
            exit 1
        fi
        
        # Login check
        if ! heroku auth:whoami &> /dev/null; then
            echo "🔐 Please login to Heroku..."
            heroku login
        fi
        
        # Create app if it doesn't exist
        read -p "Enter your Heroku app name: " APP_NAME
        
        if ! heroku apps:info $APP_NAME &> /dev/null; then
            echo "📱 Creating Heroku app: $APP_NAME"
            heroku create $APP_NAME
        fi
        
        # Set environment variables from .env
        echo "⚙️ Setting environment variables..."
        heroku config:set $(cat .env | grep -v '^#' | xargs) --app $APP_NAME
        
        # Deploy
        echo "🚀 Deploying to Heroku..."
        git push heroku main
        
        echo "✅ Deployment complete! Check logs with: heroku logs --tail --app $APP_NAME"
        ;;
        
    "railway")
        echo "🚂 Deploying to Railway..."
        
        if ! command -v railway &> /dev/null; then
            echo "❌ Railway CLI not found. Installing..."
            npm install -g @railway/cli
        fi
        
        if ! railway whoami &> /dev/null; then
            echo "🔐 Please login to Railway..."
            railway login
        fi
        
        echo "🚀 Deploying to Railway..."
        railway up
        
        echo "✅ Deployment complete!"
        ;;
        
    "docker")
        echo "🐳 Building and running with Docker..."
        
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker not found. Please install Docker first."
            exit 1
        fi
        
        # Build image
        echo "🔨 Building Docker image..."
        docker build -t elitechwiz-ai .
        
        # Stop existing container
        echo "🛑 Stopping existing container..."
        docker stop elitechwiz-ai 2>/dev/null || true
        docker rm elitechwiz-ai 2>/dev/null || true
        
        # Run new container
        echo "🚀 Starting new container..."
        docker run -d \
            --name elitechwiz-ai \
            -p 3000:3000 \
            -v $(pwd)/baileys_auth_info:/app/baileys_auth_info \
            -v $(pwd)/logs:/app/logs \
            --env-file .env \
            elitechwiz-ai
        
        echo "✅ Container started! Check logs with: docker logs -f elitechwiz-ai"
        ;;
        
    "local")
        echo "💻 Setting up for local development..."
        
        # Install dependencies
        echo "📦 Installing dependencies..."
        npm install
        
        # Start the application
        echo "🚀 Starting EliTechWiz AI..."
        npm start
        ;;
        
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo "Supported platforms: heroku, railway, docker, local"
        exit 1
        ;;
esac
