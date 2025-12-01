'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Fournisseur } from '@/types'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nom: '',
    contact: '',
    telephone: '',
    adresse: '',
  })

  useEffect(() => {
    loadFournisseurs()
  }, [])

  const loadFournisseurs = async () => {
    try {
      const { data, error } = await supabase
        .from('fournisseurs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFournisseurs(data || [])
    } catch (error) {
      console.error('Error loading fournisseurs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const { error } = await supabase
          .from('fournisseurs')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('fournisseurs')
          .insert([formData])

        if (error) throw error
      }

      setShowModal(false)
      resetForm()
      loadFournisseurs()
    } catch (error) {
      console.error('Error saving fournisseur:', error)
    }
  }

  const handleEdit = (fournisseur: Fournisseur) => {
    setEditingId(fournisseur.id)
    setFormData({
      nom: fournisseur.nom,
      contact: fournisseur.contact || '',
      telephone: fournisseur.telephone || '',
      adresse: fournisseur.adresse || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur?')) return

    try {
      const { error } = await supabase
        .from('fournisseurs')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadFournisseurs()
    } catch (error) {
      console.error('Error deleting fournisseur:', error)
    }
  }

  const resetForm = () => {
    setFormData({ nom: '', contact: '', telephone: '', adresse: '' })
    setEditingId(null)
  }

  const filteredFournisseurs = fournisseurs.filter((f) =>
    f.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fournisseurs</h1>
          <p className="text-gray-600 mt-1">Gérer vos fournisseurs</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Ajouter</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un fournisseur..."
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Téléphone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Adresse</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFournisseurs.map((fournisseur) => (
                  <tr key={fournisseur.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{fournisseur.nom}</td>
                    <td className="py-3 px-4 text-gray-600">{fournisseur.contact || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{fournisseur.telephone || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{fournisseur.adresse || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleEdit(fournisseur)}
                        className="text-indigo-600 hover:text-indigo-800 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(fournisseur.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredFournisseurs.length === 0 && (
              <div className="text-center py-8 text-gray-500">Aucun fournisseur trouvé</div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingId ? 'Modifier' : 'Ajouter'} un fournisseur
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <textarea
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  {editingId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
