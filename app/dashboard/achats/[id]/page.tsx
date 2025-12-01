'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AchatWithDetails } from '@/types'
import { ArrowLeft, Calendar, User, Truck, Package, Image as ImageIcon } from 'lucide-react'

export default function AchatDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [achat, setAchat] = useState<AchatWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadAchat(parseInt(params.id as string))
    }
  }, [params.id])

  const loadAchat = async (id: number) => {
    try {
      const { data: achatData, error: achatError } = await supabase
        .from('achats')
        .select('*, fournisseurs(nom, contact, telephone), users(username, email)')
        .eq('id', id)
        .single()

      if (achatError) throw achatError

      const { data: detailsData, error: detailsError } = await supabase
        .from('achat_details')
        .select('*, produits(nom, description, image_url)')
        .eq('achat_id', id)

      if (detailsError) throw detailsError

      setAchat({
        ...achatData,
        achat_details: detailsData,
      })
    } catch (error) {
      console.error('Error loading achat:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    )
  }

  if (!achat) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Achat non trouvé</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Détails de l&apos;achat #{achat.id}</h1>
          <p className="text-gray-600 mt-1">Informations complètes de l&apos;opération</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="text-indigo-600" size={24} />
            <h2 className="text-lg font-bold text-gray-800">Date</h2>
          </div>
          <p className="text-2xl font-semibold text-gray-700">
            {new Date(achat.date_achat).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Truck className="text-green-600" size={24} />
            <h2 className="text-lg font-bold text-gray-800">Fournisseur</h2>
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">
            {achat.fournisseurs?.nom || '-'}
          </p>
          {achat.fournisseurs?.telephone && (
            <p className="text-sm text-gray-600">Tel: {achat.fournisseurs.telephone}</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="text-purple-600" size={24} />
            <h2 className="text-lg font-bold text-gray-800">Utilisateur</h2>
          </div>
          <p className="text-xl font-semibold text-gray-700">
            {achat.users?.username || '-'}
          </p>
          {achat.users?.email && (
            <p className="text-sm text-gray-600">{achat.users.email}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Package className="text-orange-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Articles achetés</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Produit</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Quantité</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Prix unitaire</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Sous-total</th>
              </tr>
            </thead>
            <tbody>
              {achat.achat_details?.map((detail) => (
                <tr key={detail.id} className="border-b border-gray-100">
                  <td className="py-4 px-4">
                    {detail.produits?.image_url ? (
                      <img
                        src={detail.produits.image_url}
                        alt={detail.produits.nom}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon size={24} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-gray-800">{detail.produits?.nom}</p>
                      {detail.produits?.description && (
                        <p className="text-sm text-gray-500">{detail.produits.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-gray-700">
                    {detail.quantite}
                  </td>
                  <td className="py-4 px-4 text-right text-gray-700">
                    {detail.prix_unitaire.toFixed(2)} DH
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-800">
                    {(detail.quantite * detail.prix_unitaire).toFixed(2)} DH
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200">
                <td colSpan={4} className="py-4 px-4 text-right font-bold text-gray-800 text-lg">
                  Total:
                </td>
                <td className="py-4 px-4 text-right font-bold text-indigo-600 text-2xl">
                  {achat.total?.toFixed(2) || '0.00'} DH
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Créé le:</strong>{' '}
          {new Date(achat.created_at).toLocaleString('fr-FR')}
        </p>
      </div>
    </div>
  )
}
