'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Package, ShoppingCart, Truck, TrendingUp } from 'lucide-react'

interface Stats {
  totalProducts: number
  totalSuppliers: number
  totalPurchases: number
  totalValue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalSuppliers: 0,
    totalPurchases: 0,
    totalValue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [productsRes, suppliersRes, purchasesRes] = await Promise.all([
        supabase.from('produits').select('*', { count: 'exact' }),
        supabase.from('fournisseurs').select('*', { count: 'exact' }),
        supabase.from('achats').select('total'),
      ])

      const totalValue = purchasesRes.data?.reduce((sum, achat) => sum + (achat.total || 0), 0) || 0

      setStats({
        totalProducts: productsRes.count || 0,
        totalSuppliers: suppliersRes.count || 0,
        totalPurchases: purchasesRes.data?.length || 0,
        totalValue,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Produits',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Fournisseurs',
      value: stats.totalSuppliers,
      icon: Truck,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
    },
    {
      title: 'Achats',
      value: stats.totalPurchases,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
    },
    {
      title: 'Valeur Totale',
      value: `${stats.totalValue.toFixed(2)} DH`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Vue d&apos;ensemble de votre système</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                </div>
                <div className={`${card.bgLight} p-4 rounded-xl`}>
                  <Icon className={card.textColor} size={28} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Activité récente</h2>
          <p className="text-gray-500">Aucune activité récente</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Statistiques mensuelles</h2>
          <p className="text-gray-500">Graphiques à venir</p>
        </div>
      </div>
    </div>
  )
}
