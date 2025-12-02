# 🐳 Docker Quick Start

**Deploy your Purchase Management System in 3 commands!**

## ⚡ Super Fast Setup

### Step 1: Create Environment File
```bash
cp .env.local.example .env
```

Edit `.env` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://lgujywihozbbuadirbsk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-key-here
```

### Step 2: Build & Run
```bash
docker-compose up -d
```

### Step 3: Access Your App
```
http://localhost:3000
```

**That's it! Your app is running in Docker! 🎉**

---

## 🛑 Stop the App
```bash
docker-compose down
```

## 📊 View Logs
```bash
docker-compose logs -f
```

## 🔄 Update & Restart
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 🚀 Production Deployment

For production with health checks:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔧 Troubleshooting

### Check if container is running
```bash
docker ps
```

### View container logs
```bash
docker logs achats-nextjs
```

### Restart container
```bash
docker-compose restart
```

### Rebuild from scratch
```bash
docker-compose down
docker system prune -a
docker-compose up -d --build
```

---

**Full documentation**: [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
