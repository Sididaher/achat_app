# 🛒 Gestion d'Achats - Purchase Management System

A modern, full-stack purchase management system built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)

## 🎯 Features

### 🔐 Authentication System
- User registration and login
- Role-based access (Admin/Employee)
- Secure session management with Supabase Auth

### 📊 Dashboard
- Real-time statistics
- Track products, suppliers, purchases, and total value
- Clean and intuitive interface

### 👥 Suppliers Management
- Add, edit, and delete suppliers
- Store contact information
- Link suppliers to products

### 📦 Products Management
- Complete inventory control
- **Image upload support** for products
- Stock tracking with visual indicators
- Link products to categories and suppliers
- Price management

### 🗂️ Categories
- Organize products by categories
- Grid-based card layout
- Easy management

### 🛍️ Purchases Management
- Create multi-item purchases
- **Automatic stock updates**
- Detailed purchase history
- **Product images in purchase details**
- Track by date and supplier

### 👤 Users Management
- View all system users
- Role indicators
- Search functionality

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS |
| **Backend** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Storage** | Supabase Storage (for images) |
| **Icons** | Lucide React |

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+View)

### Products with Images
![Products](https://via.placeholder.com/800x400?text=Products+Management)

### Purchase Details
![Purchases](https://via.placeholder.com/800x400?text=Purchase+Details)

## 🛠️ Installation

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Sididaher/achat_app.git
cd achat_app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**

Create a project on [Supabase](https://supabase.com) and run the SQL schema:

```sql
-- See SETUP_GUIDE.md for complete SQL schema
-- Or check supabase-migrations/add_image_support.sql
```

4. **Configure environment variables**

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. **Create Storage Bucket**

In Supabase Dashboard → Storage:
- Create bucket: `product-images`
- ✅ Enable "Public bucket"

6. **Run the application**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | Complete setup checklist |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Detailed setup instructions |
| [IMAGE_UPLOAD_SETUP.md](IMAGE_UPLOAD_SETUP.md) | Image upload configuration |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System architecture |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick reference guide |

## 🗄️ Database Schema

### Tables
- **users** - System users with roles
- **fournisseurs** - Suppliers information
- **categories** - Product categories
- **produits** - Products with stock and images
- **achats** - Purchase records
- **achat_details** - Purchase line items

### Entity Relationship
```
users ──┐
        │
        ├──→ achats ──→ achat_details ──→ produits
        │                                      │
fournisseurs ──────────────────────────────────┤
        │                                      │
        └──────────────────────────────────────┘
                                               │
                                         categories
```

## 🎨 Key Features Highlights

### Image Upload
- Drag & drop support
- Preview before upload
- Supabase Storage integration
- Visual product catalog

### Real-time Updates
- Automatic stock calculation
- Live statistics
- Instant data refresh

### Responsive Design
- Mobile-friendly interface
- Modern gradient backgrounds
- Clean card-based layouts

### Search Functionality
- Search across all pages
- Filter products, suppliers, categories
- Fast client-side filtering

## 🚢 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sididaher/achat_app)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
```

## 🔒 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS) support
- Input validation
- Parameterized queries
- Foreign key constraints

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sidi Daher**
- GitHub: [@Sididaher](https://github.com/Sididaher)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- UI styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**⭐ Star this repo if you find it helpful!**

🤖 *Generated with [Claude Code](https://claude.com/claude-code)*
