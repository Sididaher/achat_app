# Gestion d'Achats - Purchase Management System

A modern, full-stack purchase management system built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Authentication System**: Login and registration with Supabase Auth
- **Dashboard**: Real-time statistics and overview
- **Suppliers Management**: Add, edit, and delete suppliers
- **Products Management**: Manage inventory with stock tracking
- **Categories**: Organize products by categories
- **Purchase Operations**: Create purchases with multiple items
- **Purchase Details**: View detailed information for each purchase
- **User Management**: View all system users
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **State Management**: React Hooks

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- PostgreSQL database (provided by Supabase)

## Setup Instructions

### 1. Clone the repository

```bash
cd achats-nextjs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the following SQL schema:

```sql
-- Create Users Table
CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'employee' CHECK (role IN ('admin','employee')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Fournisseurs (Suppliers)
CREATE TABLE fournisseurs (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    contact VARCHAR(100),
    telephone VARCHAR(20),
    adresse TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Categories
CREATE TABLE categories (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT
);

-- Create Produits (Products)
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

-- Create Achats (Purchases)
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

-- Create Achat Details
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

### 4. Configure environment variables

1. Copy `.env.local.example` to `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project settings under API.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
achats-nextjs/
├── app/
│   ├── dashboard/
│   │   ├── achats/          # Purchases pages
│   │   ├── categories/      # Categories pages
│   │   ├── fournisseurs/    # Suppliers pages
│   │   ├── produits/        # Products pages
│   │   ├── users/           # Users pages
│   │   ├── layout.tsx       # Dashboard layout
│   │   └── page.tsx         # Dashboard home
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   └── page.tsx             # Landing page
├── components/
│   ├── Navbar.tsx           # Top navigation bar
│   └── Sidebar.tsx          # Side navigation
├── lib/
│   └── supabase.ts          # Supabase client
├── types/
│   └── index.ts             # TypeScript interfaces
└── README.md
```

## Usage

### First Steps

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Add Categories**: Start by creating product categories
4. **Add Suppliers**: Add your suppliers information
5. **Add Products**: Create products and link them to categories and suppliers
6. **Create Purchases**: Record purchase operations

### Key Features

#### Dashboard
- View real-time statistics
- Track total products, suppliers, purchases, and total value

#### Suppliers Management
- Add new suppliers with contact information
- Edit existing supplier details
- Delete suppliers (with foreign key protection)

#### Products Management
- Add products with pricing and stock information
- Link products to categories and suppliers
- Visual stock indicators (green/yellow/red)

#### Purchases
- Create multi-item purchases
- Automatic stock updates
- View detailed purchase history
- Track purchase by date and supplier

## Database Schema

The system uses 6 main tables:

- **users**: System users with roles
- **fournisseurs**: Supplier information
- **categories**: Product categories
- **produits**: Products with stock and pricing
- **achats**: Purchase headers
- **achat_details**: Individual purchase items

## Security

- Supabase Row Level Security (RLS) enabled
- Authentication required for all dashboard routes
- Role-based access control (admin/employee)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

## Contributing

This is a school/learning project. Feel free to fork and modify for your needs.

## License

MIT License

## Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using Next.js and Supabase
