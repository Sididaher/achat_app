import Link from 'next/link'
import { ShoppingCart, Package, Truck, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            Gestion d&apos;Achats
          </h1>
          <p className="text-2xl text-white/90 mb-8">
            Système de gestion des achats et des stocks
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/login"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-800 transition shadow-lg"
            >
              Créer un compte
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Fournisseurs</h3>
            <p className="text-white/80">Gérez vos fournisseurs et contacts</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Produits</h3>
            <p className="text-white/80">Gérez votre inventaire de produits</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <ShoppingCart size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Achats</h3>
            <p className="text-white/80">Enregistrez vos achats facilement</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Statistiques</h3>
            <p className="text-white/80">Suivez vos performances</p>
          </div>
        </div>
      </div>
    </div>
  )
}
