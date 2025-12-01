# Quick Image Upload Setup ⚡

**3-minute setup guide**

## Step 1: Database (30 seconds)

Supabase Dashboard → SQL Editor → Run:

```sql
ALTER TABLE produits ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE achats ADD COLUMN IF NOT EXISTS image_url TEXT;
```

## Step 2: Storage (1 minute)

Supabase Dashboard → Storage → Create bucket:
- Name: `product-images`
- ✅ Check "Public bucket"
- Click Create

## Step 3: Test (1 minute)

```bash
cd achats-nextjs
npm run dev
```

Navigate to: `Produits` → `Ajouter` → Upload image!

---

## ✅ Done!

Images now work on:
- Products page (with upload)
- Purchase details (shows product images)

Full guide: [IMAGE_UPLOAD_SETUP.md](IMAGE_UPLOAD_SETUP.md)
