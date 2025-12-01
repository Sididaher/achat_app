'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Fournisseur, Produit } from '@/types'
import { Plus, Trash2, Save } from 'lucide-react'

interface PurchaseItem {
  produit_id: number
  quantite: number
  prix_unitaire: number
}

export default function NewAchatPage() {
  const router = useRouter()
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fournisseur_id: '',
    date_achat: new Date().toISOString().split('T')[0],
  })
  const [items, setItems] = useState<PurchaseItem[]>([
    { produit_id: 0, quantite: 1, prix_unitaire: 0 },
  ])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [fournisseursRes, produitsRes] = await Promise.all([
        supabase.from('fournisseurs').select('*'),
        supabase.from('produits').select('*'),
      ])

      if (fournisseursRes.error) throw fournisseursRes.error
      if (produitsRes.error) throw produitsRes.error

      setFournisseurs(fournisseursRes.data || [])
      setProduits(produitsRes.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const addItem = () => {
    setItems([...items, { produit_id: 0, quantite: 1, prix_unitaire: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof PurchaseItem, value: number) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantite * item.prix_unitaire, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Get user ID from users table
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single()

      const total = calculateTotal()

      // Insert purchase
      const { data: achatData, error: achatError } = await supabase
        .from('achats')
        .insert([
          {
            user_id: userData?.id,
            fournisseur_id: parseInt(formData.fournisseur_id),
            date_achat: formData.date_achat,
            total,
          },
        ])
        .select()
        .single()

      if (achatError) throw achatError

      // Insert purchase details
      const details = items
        .filter((item) => item.produit_id > 0)
        .map((item) => ({
          achat_id: achatData.id,
          produit_id: item.produit_id,
          quantite: item.quantite,
          prix_unitaire: item.prix_unitaire,
        }))

      const { error: detailsError } = await supabase
        .from('achat_details')
        .insert(details)

      if (detailsError) throw detailsError

      // Update product stock
      for (const item of items.filter((i) => i.produit_id > 0)) {
        const produit = produits.find((p) => p.id === item.produit_id)
        if (produit) {
          await supabase
            .from('produits')
            .update({ stock: produit.stock + item.quantite })
            .eq('id', item.produit_id)
        }
      }

      router.push('/dashboard/achats')
    } catch (error) {
      console.error('Error creating purchase:', error)
      alert('Erreur lors de la création de l\'achat')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Nouvel Achat</h1>
        <p className="text-gray-600 mt-1">Créer une nouvelle opération d&apos;achat</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fournisseur *
              </label>
              <select
                value={formData.fournisseur_id}
                onChange={(e) => setFormData({ ...formData, fournisseur_id: e.target.value })}
                required
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d&apos;achat *
              </label>
              <input
                type="date"
                value={formData.date_achat}
                onChange={(e) => setFormData({ ...formData, date_achat: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Articles</h2>
            <button
              type="button"
              onClick={addItem}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Ajouter</span>
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Produit
                  </label>
                  <select
                    value={item.produit_id}
                    onChange={(e) => {
                      const produitId = parseInt(e.target.value)
                      updateItem(index, 'produit_id', produitId)
                      const produit = produits.find((p) => p.id === produitId)
                      if (produit) {
                        updateItem(index, 'prix_unitaire', produit.prix_achat)
                      }
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="0">Sélectionner un produit</option>
                    {produits.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nom} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantite}
                    onChange={(e) => updateItem(index, 'quantite', parseInt(e.target.value))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix unitaire
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.prix_unitaire}
                    onChange={(e) => updateItem(index, 'prix_unitaire', parseFloat(e.target.value))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} className="mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">
                {calculateTotal().toFixed(2)} DH
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Save size={20} />
            <span>{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
