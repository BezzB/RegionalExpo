import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../App'
import { 
  Save, Loader2, AlertCircle, CheckSquare, Globe, Mail, 
  Phone, MapPin, Calendar, Clock, Image, Link, Settings as SettingsIcon
} from 'lucide-react'

interface AppSettings {
  id: string
  site_name: string
  site_description: string
  contact_email: string
  contact_phone: string
  contact_address: string
  event_date: string
  event_time: string
  event_location: string
  event_logo_url: string
  registration_deadline: string
  max_attendees: number
  ticket_price: number
  currency: string
  social_media: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
  }
  created_at: string
  updated_at: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    event_date: '',
    event_time: '',
    event_location: '',
    registration_deadline: '',
    max_attendees: 0,
    ticket_price: 0,
    currency: 'USD',
    social_media: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()

      if (error) throw error

      if (data) {
        setSettings(data)
        setFormData({
          site_name: data.site_name,
          site_description: data.site_description,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          contact_address: data.contact_address,
          event_date: data.event_date,
          event_time: data.event_time,
          event_location: data.event_location,
          registration_deadline: data.registration_deadline,
          max_attendees: data.max_attendees,
          ticket_price: data.ticket_price,
          currency: data.currency,
          social_media: data.social_media
        })
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo must be less than 5MB')
        return
      }
      setLogoFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      let logoUrl = settings?.event_logo_url

      if (logoFile) {
        try {
          const { data: buckets } = await supabase.storage.listBuckets()
          const settingsBucket = buckets?.find(b => b.name === 'settings')
          
          if (!settingsBucket) {
            const { error: createBucketError } = await supabase.storage.createBucket('settings', {
              public: true,
              fileSizeLimit: 5242880,
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            })
            
            if (createBucketError) throw createBucketError
          }

          const timestamp = new Date().getTime()
          const fileExt = logoFile.name.split('.').pop()
          const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('settings')
            .upload(fileName, logoFile, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from('settings')
            .getPublicUrl(fileName)

          logoUrl = publicUrl

          if (settings?.event_logo_url) {
            const oldFileName = settings.event_logo_url.split('/').pop()
            if (oldFileName) {
              await supabase.storage
                .from('settings')
                .remove([oldFileName])
            }
          }
        } catch (err) {
          throw new Error(`Logo upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }

      const { error: upsertError } = await supabase
        .from('settings')
        .upsert([{
          ...formData,
          event_logo_url: logoUrl
        }])

      if (upsertError) throw upsertError

      await fetchSettings()
      setSuccessMessage('Settings saved successfully')
    } catch (err) {
      console.error('Error saving settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Application Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your application settings and configuration.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Site Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Site Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={formData.site_name}
                    onChange={e => setFormData(prev => ({ ...prev, site_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Description
                  </label>
                  <textarea
                    value={formData.site_description}
                    onChange={e => setFormData(prev => ({ ...prev, site_description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={e => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={e => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Address
                  </label>
                  <input
                    type="text"
                    value={formData.contact_address}
                    onChange={e => setFormData(prev => ({ ...prev, contact_address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Event Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Event Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={e => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Time
                  </label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={e => setFormData(prev => ({ ...prev, event_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Location
                  </label>
                  <input
                    type="text"
                    value={formData.event_location}
                    onChange={e => setFormData(prev => ({ ...prev, event_location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.registration_deadline}
                    onChange={e => setFormData(prev => ({ ...prev, registration_deadline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Ticket Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ticket Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Attendees
                  </label>
                  <input
                    type="number"
                    value={formData.max_attendees}
                    onChange={e => setFormData(prev => ({ ...prev, max_attendees: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket Price
                  </label>
                  <input
                    type="number"
                    value={formData.ticket_price}
                    onChange={e => setFormData(prev => ({ ...prev, ticket_price: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={e => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Social Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={formData.social_media.facebook}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, facebook: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={formData.social_media.twitter}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, twitter: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={formData.social_media.instagram}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, instagram: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.social_media.linkedin}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      social_media: { ...prev.social_media, linkedin: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Event Logo */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Event Logo</h2>
              <div className="flex items-center space-x-4">
                {settings?.event_logo_url && (
                  <img
                    src={settings.event_logo_url}
                    alt="Event Logo"
                    className="w-32 h-32 object-contain border border-gray-200 rounded-lg"
                  />
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Recommended size: 512x512 pixels. Max file size: 5MB.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <CheckSquare className="w-5 h-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Success</h3>
                    <div className="mt-2 text-sm text-green-700">{successMessage}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 inline-block mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 