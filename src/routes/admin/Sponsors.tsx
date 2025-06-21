import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import { Plus, Trash2, Edit2, Loader2, Globe, Mail, Phone, Building2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useDebounce } from '../../hooks/useDebounce'
import { validateEmail, validatePhone, validateUrl } from '../../utils/validation'

interface Sponsor {
  id: string
  name: string
  description: string
  logo_url: string
  website: string
  email: string
  phone: string
  address: string
  level: string
  created_at: string
}

interface ValidationErrors {
  name?: string
  email?: string
  phone?: string
  website?: string
  level?: string
}

interface FilterOptions {
  search: string
  level: string
}

const SPONSORSHIP_LEVELS = [
  { value: 'platinum', label: 'Platinum', color: 'purple' },
  { value: 'gold', label: 'Gold', color: 'yellow' },
  { value: 'silver', label: 'Silver', color: 'gray' },
  { value: 'bronze', label: 'Bronze', color: 'orange' }
]

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    level: '',
    logo: null as File | null
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    level: ''
  })
  const debouncedSearch = useDebounce(filters.search, 300)

  const fetchSponsors = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setSponsors(data || [])
    } catch (err) {
      console.error('Error fetching sponsors:', err)
      setError(err instanceof Error ? err.message : 'Failed to load sponsors')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }))
    }
  }

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Invalid email address'
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Invalid phone number'
    }

    if (formData.website && !validateUrl(formData.website)) {
      errors.website = 'Invalid website URL'
    }

    if (!formData.level) {
      errors.level = 'Sponsorship level is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the validation errors')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      let logoUrl = selectedSponsor?.logo_url

      if (formData.logo) {
        try {
          // Check if bucket exists, if not create it
          const { data: buckets } = await supabase.storage.listBuckets()
          const sponsorsBucket = buckets?.find(b => b.name === 'sponsors')
          
          if (!sponsorsBucket) {
            const { error: createBucketError } = await supabase.storage.createBucket('sponsors', {
              public: true,
              fileSizeLimit: 5242880, // 5MB
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            })
            
            if (createBucketError) {
              throw new Error(`Failed to create sponsors bucket: ${createBucketError.message}`)
            }
          }

          const timestamp = new Date().getTime()
          const fileExt = formData.logo.name.split('.').pop()
          const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('sponsors')
            .upload(fileName, formData.logo, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            throw new Error(`Failed to upload logo: ${uploadError.message}`)
          }

          const { data: { publicUrl } } = supabase.storage
            .from('sponsors')
            .getPublicUrl(fileName)

          logoUrl = publicUrl

          if (selectedSponsor?.logo_url) {
            const oldFileName = selectedSponsor.logo_url.split('/').pop()
            if (oldFileName) {
              await supabase.storage
                .from('sponsors')
                .remove([oldFileName])
            }
          }
        } catch (err) {
          console.error('Error handling logo upload:', err)
          throw new Error(`Logo upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }

      if (selectedSponsor) {
        const { error: updateError } = await supabase
          .from('sponsors')
          .update({
            name: formData.name,
            description: formData.description,
            website: formData.website,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            level: formData.level,
            logo_url: logoUrl
          })
          .eq('id', selectedSponsor.id)

        if (updateError) {
          throw new Error(`Failed to update sponsor: ${updateError.message}`)
        }
      } else {
        const { error: insertError } = await supabase
          .from('sponsors')
          .insert([{
            name: formData.name,
            description: formData.description,
            website: formData.website,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            level: formData.level,
            logo_url: logoUrl
          }])

        if (insertError) {
          throw new Error(`Failed to create sponsor: ${insertError.message}`)
        }
      }

      await fetchSponsors()
      resetForm()
      toast.success(selectedSponsor ? 'Sponsor updated successfully' : 'Sponsor added successfully')
    } catch (err) {
      console.error('Error saving sponsor:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to save sponsor'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return

    try {
      const { data: sponsor, error: fetchError } = await supabase
        .from('sponsors')
        .select('logo_url')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(`Failed to fetch sponsor: ${fetchError.message}`)
      }

      if (sponsor?.logo_url) {
        const fileName = sponsor.logo_url.split('/').pop()
        if (fileName) {
          const { error: deleteLogoError } = await supabase.storage
            .from('sponsors')
            .remove([fileName])

          if (deleteLogoError) {
            console.error('Error deleting logo:', deleteLogoError)
          }
        }
      }

      const { error: deleteError } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(`Failed to delete sponsor: ${deleteError.message}`)
      }

      await fetchSponsors()
      toast.success('Sponsor deleted successfully')
    } catch (err) {
      console.error('Error deleting sponsor:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete sponsor'
      toast.error(errorMessage)
    }
  }

  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
    setFormData({
      name: sponsor.name,
      description: sponsor.description,
      website: sponsor.website,
      email: sponsor.email,
      phone: sponsor.phone,
      address: sponsor.address,
      level: sponsor.level,
      logo: null
    })
  }

  const resetForm = () => {
    setSelectedSponsor(null)
    setFormData({
      name: '',
      description: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      level: '',
      logo: null
    })
  }

  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = sponsor.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      sponsor.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchesLevel = !filters.level || sponsor.level === filters.level
    return matchesSearch && matchesLevel
  })

  useEffect(() => {
    fetchSponsors()
  }, [])

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
          <h1 className="text-3xl font-bold text-gray-900">Sponsor Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add and manage sponsors for your events.
          </p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search sponsors..."
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={filters.level}
              onChange={e => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Levels</option>
              {SPONSORSHIP_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
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
                  className={`w-full px-3 py-2 border ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sponsorship Level
                </label>
                <select
                  value={formData.level}
                  onChange={e => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select a level</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
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
              {selectedSponsor && (
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
                ) : selectedSponsor ? (
                  'Update Sponsor'
                ) : (
                  'Add Sponsor'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSponsors.map((sponsor) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="aspect-[16/9] relative bg-gray-100">
                <img
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(sponsor)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(sponsor.id)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {sponsor.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    sponsor.level === 'platinum' ? 'bg-purple-100 text-purple-800' :
                    sponsor.level === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    sponsor.level === 'silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {sponsor.level.charAt(0).toUpperCase() + sponsor.level.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {sponsor.description}
                </p>
                <div className="space-y-2">
                  {sponsor.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {sponsor.email}
                    </div>
                  )}
                  {sponsor.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {sponsor.phone}
                    </div>
                  )}
                  {sponsor.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      {sponsor.website}
                    </div>
                  )}
                  {sponsor.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      {sponsor.address}
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
