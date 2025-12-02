# 🐳 Docker Deployment Guide

Complete guide to deploy your Purchase Management System using Docker.

## 📋 Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)
- Supabase project configured
- Git repository cloned

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Create `.env` file** (for Docker):
```bash
cp .env.local.example .env
```

2. **Edit `.env` with your credentials**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Build and run**:
```bash
docker-compose up -d
```

4. **Access the app**:
```
http://localhost:3000
```

### Option 2: Docker CLI

1. **Build the image**:
```bash
docker build -t achats-app .
```

2. **Run the container**:
```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  --name achats-app \
  achats-app
```

3. **Access the app**:
```
http://localhost:3000
```

---

## 📦 Dockerfile Explained

Our Dockerfile uses a **multi-stage build** for optimization:

### Stage 1: Dependencies
- Installs Node.js dependencies
- Uses `npm ci` for consistent installs
- Alpine Linux for smaller image size

### Stage 2: Builder
- Builds the Next.js application
- Creates optimized production build
- Standalone output for Docker

### Stage 3: Runner
- Production-ready image
- Non-root user for security
- Only includes necessary files
- Smaller final image (~200MB)

---

## 🛠️ Common Commands

### Build
```bash
# Build image
docker build -t achats-app .

# Build with no cache
docker build --no-cache -t achats-app .
```

### Run
```bash
# Run container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down
```

### Manage
```bash
# List running containers
docker ps

# Stop container
docker stop achats-app

# Remove container
docker rm achats-app

# Remove image
docker rmi achats-app
```

### Debug
```bash
# Access container shell
docker exec -it achats-app sh

# View logs
docker logs achats-app

# Follow logs
docker logs -f achats-app
```

---

## 🌐 Production Deployment

### Deploy to Docker Hub

1. **Tag the image**:
```bash
docker tag achats-app yourusername/achats-app:latest
```

2. **Push to Docker Hub**:
```bash
docker login
docker push yourusername/achats-app:latest
```

3. **Pull and run on server**:
```bash
docker pull yourusername/achats-app:latest
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  yourusername/achats-app:latest
```

### Deploy to Cloud Platforms

#### AWS ECS
```bash
# Build for AWS
docker build -t achats-app .

# Tag for ECR
docker tag achats-app:latest aws_account_id.dkr.ecr.region.amazonaws.com/achats-app:latest

# Push to ECR
docker push aws_account_id.dkr.ecr.region.amazonaws.com/achats-app:latest
```

#### Google Cloud Run
```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT-ID/achats-app

# Deploy
gcloud run deploy achats-app \
  --image gcr.io/PROJECT-ID/achats-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure Container Instances
```bash
# Build and push to ACR
az acr build --registry myregistry --image achats-app:latest .

# Deploy
az container create \
  --resource-group myResourceGroup \
  --name achats-app \
  --image myregistry.azurecr.io/achats-app:latest \
  --dns-name-label achats-app \
  --ports 3000
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit `.env` files
- Use secrets management in production
- Rotate keys regularly

### 2. Non-Root User
The Dockerfile runs as non-root user (`nextjs:nodejs`)

### 3. Image Scanning
```bash
# Scan for vulnerabilities
docker scan achats-app
```

### 4. Network Security
```bash
# Create custom network
docker network create achats-network

# Run with custom network
docker run --network achats-network achats-app
```

---

## 📊 Performance Optimization

### Image Size
```bash
# Check image size
docker images achats-app

# Our optimized size: ~200MB
```

### Build Cache
```bash
# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t achats-app .
```

### Multi-Platform Build
```bash
# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t achats-app .
```

---

## 🔧 Troubleshooting

### Issue: Build fails at dependencies stage
**Solution**: Clear Docker cache
```bash
docker builder prune
docker build --no-cache -t achats-app .
```

### Issue: Container exits immediately
**Solution**: Check logs
```bash
docker logs achats-app
```

### Issue: Cannot connect to Supabase
**Solution**: Verify environment variables
```bash
docker exec achats-app env | grep SUPABASE
```

### Issue: Port already in use
**Solution**: Use different port
```bash
docker run -p 8080:3000 achats-app
```

### Issue: Permission denied errors
**Solution**: Check file ownership
```bash
ls -la .next
```

---

## 📈 Monitoring

### Docker Stats
```bash
# View resource usage
docker stats achats-app
```

### Health Check
Add to `docker-compose.yml`:
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Logging
```bash
# Configure logging driver
docker run --log-driver=json-file --log-opt max-size=10m achats-app
```

---

## 🎯 Best Practices Checklist

- [ ] Use multi-stage builds
- [ ] Run as non-root user
- [ ] Use `.dockerignore` file
- [ ] Pin Node.js version
- [ ] Set proper environment variables
- [ ] Configure health checks
- [ ] Implement logging
- [ ] Scan for vulnerabilities
- [ ] Optimize image size
- [ ] Use secrets management

---

## 📚 Additional Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

## 🎉 Quick Deploy Commands

### Development
```bash
docker-compose up
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Stop Everything
```bash
docker-compose down
```

---

**Your app is now containerized and ready for deployment anywhere! 🚀**
