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
  totalPayments: number
  totalRevenue: number
  pendingPayments: number
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
    totalPayments: 0,
    totalRevenue: 0,
    pendingPayments: 0
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
          { count: contactsCount },
          { data: payments },
          { count: pendingCount }
        ] = await Promise.all([
          supabase.from('events').select('*', { count: 'exact' }),
          supabase.from('sponsors').select('*', { count: 'exact' }),
          supabase.from('gallery').select('*', { count: 'exact' }),
          supabase.from('contacts').select('*', { count: 'exact' }),
          supabase.from('purchases').select('amount_paid'),
          supabase.from('purchases').select('*', { count: 'exact' }).eq('status', 'pending')
        ])

        const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0

        setStats({
          totalEvents: eventsCount || 0,
          totalSponsors: sponsorsCount || 0,
          totalGalleryItems: galleryCount || 0,
          totalContacts: contactsCount || 0,
          totalPayments: payments?.length || 0,
          totalRevenue,
          pendingPayments: pendingCount || 0
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
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Total Events</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalEvents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Total Sponsors</h2>
          <p className="text-3xl font-bold text-green-600">{stats.totalSponsors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Gallery Items</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.totalGalleryItems}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Contact Messages</h2>
          <p className="text-3xl font-bold text-orange-600">{stats.totalContacts}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h2>
            <p className="text-3xl font-bold text-emerald-600">
              KES {stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Total Payments</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalPayments}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Pending Payments</h2>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingPayments}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

