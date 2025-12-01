# Quick Reference Guide

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Setup
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit with your credentials
# NEXT_PUBLIC_SUPABASE_URL=your-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## URLs Reference

| Page | URL | Access |
|------|-----|--------|
| Landing Page | `/` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/dashboard` | Protected |
| Suppliers | `/dashboard/fournisseurs` | Protected |
| Categories | `/dashboard/categories` | Protected |
| Products | `/dashboard/produits` | Protected |
| Purchases List | `/dashboard/achats` | Protected |
| New Purchase | `/dashboard/achats/new` | Protected |
| Purchase Details | `/dashboard/achats/[id]` | Protected |
| Users | `/dashboard/users` | Protected |

## File Locations Quick Reference

| What | Where |
|------|-------|
| Add new page | `app/dashboard/[name]/page.tsx` |
| Add component | `components/[Name].tsx` |
| Types/Interfaces | `types/index.ts` |
| Supabase config | `lib/supabase.ts` |
| Environment vars | `.env.local` |
| Styles config | `tailwind.config.ts` |

## Code Snippets

### Create New CRUD Page Template

```tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NewPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('your_table')
        .select('*')

      if (error) throw error
      setData(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Your content */}
    </div>
  )
}
```

### Add New Type

```typescript
// In types/index.ts
export interface YourType {
  id: number
  name: string
  created_at: string
}
```

### Supabase Query Examples

```typescript
// SELECT
const { data } = await supabase
  .from('table')
  .select('*')

// SELECT with JOIN
const { data } = await supabase
  .from('table')
  .select('*, related_table(field)')

// INSERT
const { data, error } = await supabase
  .from('table')
  .insert([{ field: 'value' }])

// UPDATE
const { data, error } = await supabase
  .from('table')
  .update({ field: 'new_value' })
  .eq('id', id)

// DELETE
const { error } = await supabase
  .from('table')
  .delete()
  .eq('id', id)

// COUNT
const { count } = await supabase
  .from('table')
  .select('*', { count: 'exact' })
```

## Common Tailwind Classes

### Layout
```
flex, grid, container
flex-col, flex-row
items-center, justify-between
space-x-4, space-y-4
gap-4, gap-6
p-4, p-6, px-4, py-4
m-4, mx-auto, mt-4
```

### Sizing
```
w-full, w-64, w-1/2
h-full, h-screen
max-w-md, max-w-4xl
min-h-screen
```

### Colors
```
bg-white, bg-gray-50
text-gray-600, text-indigo-600
border-gray-200
hover:bg-indigo-700
```

### Text
```
text-sm, text-base, text-xl, text-3xl
font-medium, font-semibold, font-bold
text-center, text-left, text-right
```

### Borders & Shadows
```
rounded-lg, rounded-xl, rounded-full
border, border-2
shadow-md, shadow-lg, shadow-2xl
```

### Responsive
```
md:grid-cols-2
lg:grid-cols-4
sm:text-left
```

## Database Quick Reference

### Tables
1. **users** - System users
2. **fournisseurs** - Suppliers
3. **categories** - Product categories
4. **produits** - Products
5. **achats** - Purchases
6. **achat_details** - Purchase items

### Relationships
- `produits.categorie_id` → `categories.id`
- `produits.fournisseur_id` → `fournisseurs.id`
- `achats.user_id` → `users.id`
- `achats.fournisseur_id` → `fournisseurs.id`
- `achat_details.achat_id` → `achats.id`
- `achat_details.produit_id` → `produits.id`

## Troubleshooting

### Issue: Changes not appearing
**Solution**: Hard refresh (Ctrl + Shift + R) or restart dev server

### Issue: Supabase connection failed
**Solution**:
1. Check `.env.local` exists
2. Verify credentials are correct
3. Restart dev server after changing env vars

### Issue: TypeScript errors
**Solution**:
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build errors
**Solution**:
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Issue: Styling not working
**Solution**: Check `tailwind.config.ts` content paths

## Git Workflow

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Add remote
git remote add origin your-repo-url

# Push
git push -u origin main

# Daily workflow
git add .
git commit -m "Description of changes"
git push
```

## Deployment Checklist

- [ ] Create Supabase project
- [ ] Run database schema
- [ ] Get Supabase URL and anon key
- [ ] Push code to GitHub
- [ ] Create Vercel project
- [ ] Link GitHub repo
- [ ] Add environment variables in Vercel
- [ ] Deploy
- [ ] Test production site

## Performance Tips

1. Use `loading` states for better UX
2. Add search functionality for large datasets
3. Consider pagination for 100+ records
4. Optimize images with Next.js Image component
5. Use Supabase indexes for frequent queries

## Security Best Practices

1. Never commit `.env.local`
2. Use environment variables for secrets
3. Validate user input
4. Implement Row Level Security in Supabase
5. Use HTTPS in production
6. Keep dependencies updated

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Hooks Reference](https://react.dev/reference/react)

## Support

For questions or issues:
1. Check the README.md
2. Review SETUP_GUIDE.md
3. Check browser console for errors
4. Review Supabase logs

---

**Pro Tip**: Keep this file open while developing for quick reference!
