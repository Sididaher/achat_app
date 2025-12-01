'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bell, User } from 'lucide-react'

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
      }
    }
    getUser()
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Bienvenue</h2>
          <p className="text-sm text-gray-600">Gérez vos achats efficacement</p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3 bg-gray-100 px-4 py-2 rounded-lg">
            <User size={20} className="text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {userEmail || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500">Employee</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
