'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Achat } from '@/types'
import { Plus, Eye, Trash2, Search } from 'lucide-react'
import Link from 'next/link'

export default function AchatsPage() {
  const [achats, setAchats] = useState<Achat[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAchats()
  }, [])

  const loadAchats = async () => {
    try {
      const { data, error } = await supabase
        .from('achats')
        .select('*, fournisseurs(nom), users(username)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAchats(data || [])
    } catch (error) {
      console.error('Error loading achats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet achat?')) return

    try {
      const { error } = await supabase
        .from('achats')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadAchats()
    } catch (error) {
      console.error('Error deleting achat:', error)
    }
  }

  const filteredAchats = achats.filter((a) => {
    const fournisseurNom = a.fournisseurs?.nom || ''
    const dateAchat = a.date_achat || ''
    return (
      fournisseurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dateAchat.includes(searchTerm)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Achats</h1>
          <p className="text-gray-600 mt-1">Gérer vos opérations d&apos;achat</p>
        </div>
        <Link
          href="/dashboard/achats/new"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nouvel Achat</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un achat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fournisseur</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Utilisateur</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAchats.map((achat) => (
                  <tr key={achat.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">#{achat.id}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(achat.date_achat).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {achat.fournisseurs?.nom || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {achat.users?.username || '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800">
                      {achat.total?.toFixed(2) || '0.00'} DH
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dashboard/achats/${achat.id}`}
                        className="text-indigo-600 hover:text-indigo-800 mr-3"
                      >
                        <Eye size={18} className="inline" />
                      </Link>
                      <button
                        onClick={() => handleDelete(achat.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAchats.length === 0 && (
              <div className="text-center py-8 text-gray-500">Aucun achat trouvé</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
