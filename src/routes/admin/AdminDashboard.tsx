import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

interface AdminStats {
  totalEvents: number
  totalSponsors: number
  totalGalleryItems: number
  totalContacts: number
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalEvents: 0,
    totalSponsors: 0,
    totalGalleryItems: 0,
    totalContacts: 0,
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/admin/login')
        return
      }
      fetchStats()
    }

    const fetchStats = async () => {
      try {
        const [
          { count: eventsCount },
          { count: sponsorsCount },
          { count: galleryCount },
          { count: contactsCount }
        ] = await Promise.all([
          supabase.from('events').select('*', { count: 'exact' }),
          supabase.from('sponsors').select('*', { count: 'exact' }),
          supabase.from('gallery').select('*', { count: 'exact' }),
          supabase.from('contacts').select('*', { count: 'exact' })
        ])

        setStats({
          totalEvents: eventsCount || 0,
          totalSponsors: sponsorsCount || 0,
          totalGalleryItems: galleryCount || 0,
          totalContacts: contactsCount || 0
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to fetch dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of your event management system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Events</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalEvents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Sponsors</h2>
          <p className="text-3xl font-bold text-green-600">{stats.totalSponsors}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Gallery Items</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.totalGalleryItems}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Contact Messages</h2>
          <p className="text-3xl font-bold text-orange-600">{stats.totalContacts}</p>
        </div>
      </div>
    </motion.div>
  )
}

