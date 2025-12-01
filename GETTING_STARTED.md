# Getting Started - Complete Checklist

Follow this checklist step-by-step to get your application running.

## ✅ Pre-Requirements (5 minutes)

- [ ] **Node.js 18+** installed
  - Check: `node --version`
  - Download: https://nodejs.org

- [ ] **npm** or **yarn** installed
  - Check: `npm --version`

- [ ] **Text Editor** (VS Code recommended)
  - Download: https://code.visualstudio.com

- [ ] **Supabase Account** (free tier is enough)
  - Sign up: https://supabase.com

## 📦 Step 1: Install Dependencies (2 minutes)

```bash
cd achats-nextjs
npm install
```

**Expected Output**: Successfully installed ~400 packages

✅ **Checkpoint**: No error messages during installation

## 🗄️ Step 2: Set Up Supabase Database (10 minutes)

### A. Create Supabase Project

1. [ ] Go to https://supabase.com/dashboard
2. [ ] Click "New Project"
3. [ ] Fill in:
   - Project name: `achats-app` (or any name)
   - Database password: (save this!)
   - Region: Choose closest to you
4. [ ] Click "Create project"
5. [ ] Wait for setup to complete (~2 minutes)

### B. Create Database Tables

1. [ ] In Supabase dashboard, go to **SQL Editor**
2. [ ] Click "New Query"
3. [ ] Copy and paste this SQL:

```sql
-- Users Table
CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('admin','employee')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Suppliers Table
CREATE TABLE fournisseurs (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    contact VARCHAR(100),
    telephone VARCHAR(20),
    adresse TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Categories Table
CREATE TABLE categories (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT
);

-- Products Table
CREATE TABLE produits (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix_achat NUMERIC(12,2) NOT NULL,
    stock INT DEFAULT 0,
    categorie_id INT,
    fournisseur_id INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT fk_categorie FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_fournisseur FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id) ON DELETE SET NULL
);

-- Purchases Table
CREATE TABLE achats (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT,
    fournisseur_id INT,
    date_achat DATE NOT NULL,
    total NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_achat_fournisseur FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id) ON DELETE SET NULL
);

-- Purchase Details Table
CREATE TABLE achat_details (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    achat_id INT NOT NULL,
    produit_id INT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire NUMERIC(12,2) NOT NULL,
    CONSTRAINT fk_achat FOREIGN KEY (achat_id) REFERENCES achats(id) ON DELETE CASCADE,
    CONSTRAINT fk_produit FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE RESTRICT
);
```

4. [ ] Click **"Run"** or press `Ctrl+Enter`
5. [ ] Check for "Success" message

✅ **Checkpoint**: All 6 tables created successfully

### C. Configure Authentication

1. [ ] Go to **Authentication** → **Providers**
2. [ ] Ensure **Email** is enabled (should be by default)
3. [ ] Scroll to **Email Auth** settings
4. [ ] **Disable** "Confirm email" (for development)
5. [ ] Click **Save**

✅ **Checkpoint**: Email provider is enabled

### D. Get API Credentials

1. [ ] Go to **Project Settings** (gear icon)
2. [ ] Click **API** in sidebar
3. [ ] Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

✅ **Checkpoint**: Both values copied

## 🔐 Step 3: Configure Environment Variables (2 minutes)

1. [ ] In your project folder, create `.env.local` file:

```bash
# On Windows
copy .env.local.example .env.local

# On Mac/Linux
cp .env.local.example .env.local
```

2. [ ] Open `.env.local` in your editor
3. [ ] Replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. [ ] Save the file

✅ **Checkpoint**: `.env.local` file exists with real values

## 🚀 Step 4: Run the Application (1 minute)

```bash
npm run dev
```

**Expected Output**:
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in XXXms
```

✅ **Checkpoint**: Server running without errors

## 🧪 Step 5: Test the Application (10 minutes)

### Test 1: Landing Page
1. [ ] Open browser: http://localhost:3000
2. [ ] See landing page with gradient background
3. [ ] See "Se connecter" and "Créer un compte" buttons

### Test 2: Register Account
1. [ ] Click **"Créer un compte"**
2. [ ] Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. [ ] Click **"Créer un compte"**
4. [ ] Should redirect to login page

✅ **Checkpoint**: Account created successfully

### Test 3: Login
1. [ ] At `/login`, enter:
   - Email: `test@example.com`
   - Password: `password123`
2. [ ] Click **"Se connecter"**
3. [ ] Should redirect to dashboard

✅ **Checkpoint**: Successfully logged in

### Test 4: Dashboard
1. [ ] See dashboard with sidebar
2. [ ] See statistics cards (all showing 0)
3. [ ] See navigation menu

✅ **Checkpoint**: Dashboard loads

### Test 5: Add Category
1. [ ] Click **"Catégories"** in sidebar
2. [ ] Click **"Ajouter"** button
3. [ ] Fill in:
   - Nom: `Électronique`
   - Description: `Produits électroniques`
4. [ ] Click **"Ajouter"**
5. [ ] See category card appear

✅ **Checkpoint**: Category created

### Test 6: Add Supplier
1. [ ] Click **"Fournisseurs"** in sidebar
2. [ ] Click **"Ajouter"**
3. [ ] Fill in:
   - Nom: `TechSupply Morocco`
   - Contact: `Ahmed Alami`
   - Téléphone: `+212 6 12 34 56 78`
   - Adresse: `123 Rue Mohammed V, Casablanca`
4. [ ] Click **"Ajouter"**
5. [ ] See supplier in table

✅ **Checkpoint**: Supplier created

### Test 7: Add Product
1. [ ] Click **"Produits"** in sidebar
2. [ ] Click **"Ajouter"**
3. [ ] Fill in:
   - Nom: `Ordinateur Portable HP`
   - Description: `HP ProBook 450 G8`
   - Prix d'achat: `5500.00`
   - Stock: `10`
   - Catégorie: Select `Électronique`
   - Fournisseur: Select `TechSupply Morocco`
4. [ ] Click **"Ajouter"**
5. [ ] See product in table with green stock badge

✅ **Checkpoint**: Product created

### Test 8: Create Purchase
1. [ ] Click **"Achats"** in sidebar
2. [ ] Click **"Nouvel Achat"**
3. [ ] Fill in:
   - Fournisseur: Select `TechSupply Morocco`
   - Date: Today's date (pre-filled)
   - Produit: Select `Ordinateur Portable HP`
   - Quantité: `5`
   - Prix unitaire: `5500.00` (should auto-fill)
4. [ ] Click **"Enregistrer"**
5. [ ] Redirected to purchases list
6. [ ] See purchase with total `27500.00 DH`

✅ **Checkpoint**: Purchase created

### Test 9: View Purchase Details
1. [ ] Click the eye icon on the purchase
2. [ ] See complete purchase details
3. [ ] See supplier, user, and items information

✅ **Checkpoint**: Details page works

### Test 10: Check Dashboard Stats
1. [ ] Go back to **"Tableau de bord"**
2. [ ] Verify statistics updated:
   - Products: 1
   - Suppliers: 1
   - Purchases: 1
   - Total Value: 27500.00 DH

✅ **Checkpoint**: Statistics are accurate

## 🎉 Success!

If all checkpoints passed, your application is working perfectly!

## 📊 What You've Built

- ✅ Full authentication system
- ✅ Dashboard with real-time statistics
- ✅ Suppliers management
- ✅ Categories management
- ✅ Products with stock tracking
- ✅ Multi-item purchases
- ✅ Purchase history
- ✅ Responsive design

## 🚀 Next Steps

### For Development
- [ ] Read through the code to understand structure
- [ ] Try editing records
- [ ] Try deleting records
- [ ] Test search functionality
- [ ] Test on mobile (responsive)

### For Customization
- [ ] Change color scheme in Tailwind config
- [ ] Add more fields to tables
- [ ] Implement pagination
- [ ] Add export functionality
- [ ] Add charts/graphs

### For Production
- [ ] Enable RLS (Row Level Security) in Supabase
- [ ] Set up proper authentication flows
- [ ] Configure email templates
- [ ] Deploy to Vercel
- [ ] Set up custom domain

## 🆘 Getting Help

If something didn't work:

1. **Check the console** (F12 in browser)
   - Look for error messages

2. **Common issues**:
   - `.env.local` not loaded? → Restart dev server
   - Supabase errors? → Check credentials
   - Database errors? → Verify tables exist

3. **Review documentation**:
   - `README.md` - Full documentation
   - `SETUP_GUIDE.md` - Detailed setup
   - `QUICK_REFERENCE.md` - Code snippets
   - `ARCHITECTURE.md` - System design

4. **Supabase Dashboard**:
   - Check Table Editor to verify data
   - Check Logs for errors
   - Check Auth to see users

## 📝 Notes

- **Development URL**: http://localhost:3000
- **Default Port**: 3000 (change in package.json if needed)
- **Database**: Hosted on Supabase (PostgreSQL)
- **Authentication**: Handled by Supabase Auth

## 🎓 Learning Resources

Want to understand the code better?

1. **Next.js App Router**: https://nextjs.org/docs/app
2. **React Hooks**: https://react.dev/reference/react
3. **TypeScript**: https://www.typescriptlang.org/docs
4. **Tailwind CSS**: https://tailwindcss.com/docs
5. **Supabase**: https://supabase.com/docs

---

**Congratulations!** You now have a fully functional purchase management system! 🎊
