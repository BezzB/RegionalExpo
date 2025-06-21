import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import { 
  Bell, Loader2, AlertCircle, CheckSquare, Trash2, 
  Mail, MessageSquare, Calendar, Star, Settings
} from 'lucide-react'

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'email' | 'system' | 'event' | 'reminder'
  read: boolean
  created_at: string
}

const NOTIFICATION_TYPES = {
  email: { icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
  system: { icon: Settings, color: 'text-gray-500', bg: 'bg-gray-50' },
  event: { icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
  reminder: { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' }
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setNotifications(data || [])
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      )
      setSuccessMessage('All notifications marked as read')
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read')
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error

      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      )
    } catch (err) {
      console.error('Error deleting notification:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete notification')
    }
  }

  const clearAllNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setNotifications([])
      setSuccessMessage('All notifications cleared')
    } catch (err) {
      console.error('Error clearing notifications:', err)
      setError(err instanceof Error ? err.message : 'Failed to clear notifications')
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false
    if (selectedType && notification.type !== selectedType) return false
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your notifications and stay updated with the latest information.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as 'all' | 'unread')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread Only</option>
                </select>

                <select
                  value={selectedType || ''}
                  onChange={e => setSelectedType(e.target.value || null)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Types</option>
                  <option value="email">Email</option>
                  <option value="system">System</option>
                  <option value="event">Event</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckSquare className="w-4 h-4 inline-block mr-2" />
                  Mark All as Read
                </button>

                <button
                  onClick={clearAllNotifications}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="w-4 h-4 inline-block mr-2" />
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-green-50 border-b border-green-200">
              <div className="flex">
                <CheckSquare className="w-5 h-5 text-green-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Success</h3>
                  <div className="mt-2 text-sm text-green-700">{successMessage}</div>
                </div>
              </div>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No notifications found
              </div>
            ) : (
              filteredNotifications.map(notification => {
                const Icon = NOTIFICATION_TYPES[notification.type].icon
                const color = NOTIFICATION_TYPES[notification.type].color
                const bg = NOTIFICATION_TYPES[notification.type].bg

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 ${notification.read ? 'bg-white' : bg}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${bg}`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-400">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <CheckSquare className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
