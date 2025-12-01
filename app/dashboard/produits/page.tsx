'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Produit, Fournisseur, Category } from '@/types'
import { Plus, Edit, Trash2, Search, Image as ImageIcon } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([])
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix_achat: '',
    stock: '',
    categorie_id: '',
    fournisseur_id: '',
    image_url: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [produitsRes, fournisseursRes, categoriesRes] = await Promise.all([
        supabase
          .from('produits')
          .select('*, categories(nom), fournisseurs(nom)')
          .order('created_at', { ascending: false }),
        supabase.from('fournisseurs').select('*'),
        supabase.from('categories').select('*'),
      ])

      if (produitsRes.error) throw produitsRes.error
      if (fournisseursRes.error) throw fournisseursRes.error
      if (categoriesRes.error) throw categoriesRes.error

      setProduits(produitsRes.data || [])
      setFournisseurs(fournisseursRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dataToSave = {
      nom: formData.nom,
      description: formData.description || null,
      prix_achat: parseFloat(formData.prix_achat),
      stock: parseInt(formData.stock),
      categorie_id: formData.categorie_id ? parseInt(formData.categorie_id) : null,
      fournisseur_id: formData.fournisseur_id ? parseInt(formData.fournisseur_id) : null,
      image_url: formData.image_url || null,
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('produits')
          .update(dataToSave)
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('produits')
          .insert([dataToSave])

        if (error) throw error
      }

      setShowModal(false)
      resetForm()
      loadData()
    } catch (error) {
      console.error('Error saving produit:', error)
    }
  }

  const handleEdit = (produit: Produit) => {
    setEditingId(produit.id)
    setFormData({
      nom: produit.nom,
      description: produit.description || '',
      prix_achat: produit.prix_achat.toString(),
      stock: produit.stock.toString(),
      categorie_id: produit.categorie_id?.toString() || '',
      fournisseur_id: produit.fournisseur_id?.toString() || '',
      image_url: produit.image_url || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return

    try {
      const { error } = await supabase
        .from('produits')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Error deleting produit:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      prix_achat: '',
      stock: '',
      categorie_id: '',
      fournisseur_id: '',
      image_url: '',
    })
    setEditingId(null)
  }

  const filteredProduits = produits.filter((p) =>
    p.nom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Produits</h1>
          <p className="text-gray-600 mt-1">Gérer votre inventaire</p>
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
              placeholder="Rechercher un produit..."
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
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Catégorie</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fournisseur</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Prix d&apos;achat</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Stock</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProduits.map((produit) => (
                  <tr key={produit.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {produit.image_url ? (
                        <img
                          src={produit.image_url}
                          alt={produit.nom}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">{produit.nom}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {produit.categories?.nom || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {produit.fournisseurs?.nom || '-'}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {produit.prix_achat.toFixed(2)} DH
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          produit.stock > 10
                            ? 'bg-green-100 text-green-700'
                            : produit.stock > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {produit.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleEdit(produit)}
                        className="text-indigo-600 hover:text-indigo-800 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(produit.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProduits.length === 0 && (
              <div className="text-center py-8 text-gray-500">Aucun produit trouvé</div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingId ? 'Modifier' : 'Ajouter'} un produit
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                onImageRemoved={() => setFormData({ ...formData, image_url: '' })}
              />

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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix d&apos;achat *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.prix_achat}
                  onChange={(e) => setFormData({ ...formData, prix_achat: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.categorie_id}
                  onChange={(e) => setFormData({ ...formData, categorie_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fournisseur
                </label>
                <select
                  value={formData.fournisseur_id}
                  onChange={(e) => setFormData({ ...formData, fournisseur_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">Sélectionner un fournisseur</option>
                  {fournisseurs.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nom}
                    </option>
                  ))}
                </select>
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
