import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../App'
import { Plus, Trash2, Edit2, Loader2, Globe, Mail, Phone, Building2 } from 'lucide-react'

interface Partner {
  id: string
  name: string
  description: string
  logo_url: string
  website: string
  email: string
  phone: string
  address: string
  partnership_type: string
  created_at: string
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    partnership_type: '',
    logo: null as File | null
  })

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setPartners(data || [])
    } catch (err) {
      console.error('Error fetching partners:', err)
      setError(err instanceof Error ? err.message : 'Failed to load partners')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let logoUrl = selectedPartner?.logo_url

      if (formData.logo) {
        try {
          // Check if bucket exists, if not create it
          const { data: buckets } = await supabase.storage.listBuckets()
          const partnersBucket = buckets?.find(b => b.name === 'partners')
          
          if (!partnersBucket) {
            const { error: createBucketError } = await supabase.storage.createBucket('partners', {
              public: true,
              fileSizeLimit: 5242880, // 5MB
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            })
            
            if (createBucketError) {
              throw new Error(`Failed to create partners bucket: ${createBucketError.message}`)
            }
          }

          const timestamp = new Date().getTime()
          const fileExt = formData.logo.name.split('.').pop()
          const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('partners')
            .upload(fileName, formData.logo, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            throw new Error(`Failed to upload logo: ${uploadError.message}`)
          }

          const { data: { publicUrl } } = supabase.storage
            .from('partners')
            .getPublicUrl(fileName)

          logoUrl = publicUrl

          if (selectedPartner?.logo_url) {
            const oldFileName = selectedPartner.logo_url.split('/').pop()
            if (oldFileName) {
              await supabase.storage
                .from('partners')
                .remove([oldFileName])
            }
          }
        } catch (err) {
          console.error('Error handling logo upload:', err)
          throw new Error(`Logo upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }

      if (selectedPartner) {
        const { error: updateError } = await supabase
          .from('partners')
          .update({
            name: formData.name,
            description: formData.description,
            website: formData.website,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            partnership_type: formData.partnership_type,
            logo_url: logoUrl
          })
          .eq('id', selectedPartner.id)

        if (updateError) {
          throw new Error(`Failed to update partner: ${updateError.message}`)
        }
      } else {
        const { error: insertError } = await supabase
          .from('partners')
          .insert([{
            name: formData.name,
            description: formData.description,
            website: formData.website,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            partnership_type: formData.partnership_type,
            logo_url: logoUrl
          }])

        if (insertError) {
          throw new Error(`Failed to create partner: ${insertError.message}`)
        }
      }

      await fetchPartners()
      resetForm()
    } catch (err) {
      console.error('Error saving partner:', err)
      setError(err instanceof Error ? err.message : 'Failed to save partner')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return

    try {
      const { data: partner, error: fetchError } = await supabase
        .from('partners')
        .select('logo_url')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(`Failed to fetch partner: ${fetchError.message}`)
      }

      if (partner?.logo_url) {
        const fileName = partner.logo_url.split('/').pop()
        if (fileName) {
          const { error: deleteLogoError } = await supabase.storage
            .from('partners')
            .remove([fileName])

          if (deleteLogoError) {
            console.error('Error deleting logo:', deleteLogoError)
          }
        }
      }

      const { error: deleteError } = await supabase
        .from('partners')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(`Failed to delete partner: ${deleteError.message}`)
      }

      await fetchPartners()
    } catch (err) {
      console.error('Error deleting partner:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete partner')
    }
  }

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner)
    setFormData({
      name: partner.name,
      description: partner.description,
      website: partner.website,
      email: partner.email,
      phone: partner.phone,
      address: partner.address,
      partnership_type: partner.partnership_type,
      logo: null
    })
  }

  const resetForm = () => {
    setSelectedPartner(null)
    setFormData({
      name: '',
      description: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      partnership_type: '',
      logo: null
    })
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
          <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add and manage partners for your events.
          </p>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedPartner ? 'Edit Partner' : 'Add New Partner'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Partnership Type
                </label>
                <select
                  value={formData.partnership_type}
                  onChange={e => setFormData(prev => ({ ...prev, partnership_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="strategic">Strategic</option>
                  <option value="technology">Technology</option>
                  <option value="media">Media</option>
                  <option value="community">Community</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <span className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    {formData.logo ? 'Change Logo' : 'Upload Logo'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
                {formData.logo && (
                  <span className="ml-3 text-sm text-gray-500">
                    {formData.logo.name}
                  </span>
                )}
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <div className="flex justify-end space-x-3">
              {selectedPartner && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : selectedPartner ? (
                  'Update Partner'
                ) : (
                  'Add Partner'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="aspect-[16/9] relative bg-gray-100">
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(partner)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(partner.id)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {partner.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    partner.partnership_type === 'strategic' ? 'bg-blue-100 text-blue-800' :
                    partner.partnership_type === 'technology' ? 'bg-purple-100 text-purple-800' :
                    partner.partnership_type === 'media' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {partner.partnership_type.charAt(0).toUpperCase() + partner.partnership_type.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {partner.description}
                </p>
                <div className="space-y-2">
                  {partner.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {partner.email}
                    </div>
                  )}
                  {partner.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {partner.phone}
                    </div>
                  )}
                  {partner.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      {partner.website}
                    </div>
                  )}
                  {partner.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      {partner.address}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 