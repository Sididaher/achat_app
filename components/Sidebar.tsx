'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, ShoppingCart, Truck, Users, FolderOpen, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const menuItems = [
  { icon: Home, label: 'Tableau de bord', href: '/dashboard' },
  { icon: Truck, label: 'Fournisseurs', href: '/dashboard/fournisseurs' },
  { icon: FolderOpen, label: 'Catégories', href: '/dashboard/categories' },
  { icon: Package, label: 'Produits', href: '/dashboard/produits' },
  { icon: ShoppingCart, label: 'Achats', href: '/dashboard/achats' },
  { icon: Users, label: 'Utilisateurs', href: '/dashboard/users' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-indigo-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-indigo-800">
        <h1 className="text-2xl font-bold">Gestion Achats</h1>
        <p className="text-indigo-300 text-sm mt-1">Système de gestion</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-indigo-700 text-white'
                      : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-indigo-800">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-indigo-200 hover:bg-indigo-800 hover:text-white transition w-full"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
