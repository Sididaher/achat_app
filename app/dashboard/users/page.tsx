'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'
import { Search, Shield, Users as UsersIcon } from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Liste des utilisateurs du système</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-indigo-600 p-3 rounded-full">
                    <UsersIcon className="text-white" size={24} />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.role === 'admin' ? (
                      <span className="flex items-center space-x-1">
                        <Shield size={12} />
                        <span>Admin</span>
                      </span>
                    ) : (
                      'Employee'
                    )}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{user.username}</h3>
                <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                <p className="text-xs text-gray-500">
                  Inscrit le: {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">Aucun utilisateur trouvé</div>
        )}
      </div>
    </div>
  )
}
