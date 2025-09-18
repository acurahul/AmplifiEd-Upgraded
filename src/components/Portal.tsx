import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, CheckCircle, Sparkles } from 'lucide-react'

const Portal: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-violet-400" size={24} />
              <span className="text-2xl font-bold text-white">AmplifiEd Portal</span>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="mr-2" size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full mb-8">
            <CheckCircle className="text-white" size={40} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Welcome to AmplifiEd!
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            You've successfully accessed the AmplifiEd portal. This is where the magic happens.
          </p>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Account Information</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-gray-400">Account Status:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Member Since:</span>
                <span className="text-white font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl border border-violet-500/20">
            <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-300">
              The full AmplifiEd platform is currently in development. You'll be among the first to access all features when we launch on November 22nd 2025.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Portal