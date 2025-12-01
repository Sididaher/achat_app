# Quick Setup Guide - Gestion d'Achats

## Step-by-Step Setup

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Supabase Configuration

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to be ready

#### B. Run SQL Schema
Go to SQL Editor and execute this complete schema:

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

#### C. Configure Authentication
1. Go to Authentication > Providers
2. Enable Email provider
3. Disable email confirmation (for development)
4. Save settings

#### D. Get API Keys
1. Go to Project Settings > API
2. Copy `Project URL` to `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. First User Setup

1. Go to `/register`
2. Create an account
3. Login at `/login`
4. Start using the dashboard

## Testing the Application

### Test Data Examples

#### Categories
- Électronique
- Alimentation
- Fournitures de bureau

#### Suppliers
- Nom: Fournisseur ABC
- Contact: Ahmed Alami
- Téléphone: +212 6 12 34 56 78
- Adresse: Casablanca, Morocco

#### Products
- Nom: Ordinateur Portable
- Prix d'achat: 5500.00 DH
- Stock: 10
- Catégorie: Électronique
- Fournisseur: Fournisseur ABC

## Troubleshooting

### Common Issues

**Issue**: "Invalid API key"
- **Solution**: Check your `.env.local` file and restart dev server

**Issue**: "Table does not exist"
- **Solution**: Run the SQL schema in Supabase SQL Editor

**Issue**: "Authentication failed"
- **Solution**: Check Supabase Auth settings and ensure email provider is enabled

**Issue**: "Cannot insert into table"
- **Solution**: Check Row Level Security (RLS) policies in Supabase

### Disable RLS for Development (Optional)

If you have issues with permissions:

```sql
-- Disable RLS on all tables (for development only)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE fournisseurs DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE produits DISABLE ROW LEVEL SECURITY;
ALTER TABLE achats DISABLE ROW LEVEL SECURITY;
ALTER TABLE achat_details DISABLE ROW LEVEL SECURITY;
```

**Warning**: This removes security. For production, implement proper RLS policies.

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to add these in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify Supabase connection
3. Ensure all environment variables are set
4. Check database schema is properly created

---

Happy coding! 🚀
