import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../App'
import { 
  Plus, Trash2, Edit2, Loader2, Globe, Mail, Phone, Building2, MapPin,
  Search, Filter, Download, CheckSquare, Square, AlertCircle, X
} from 'lucide-react'
import { validateEmail, validatePhone, validateUrl } from '../../utils/validation'
import { useDebounce } from '../../hooks/useDebounce'

interface Exhibitor {
  id: string
  name: string
  description: string
  logo_url: string
  website: string
  email: string
  phone: string
  address: string
  booth_number: string
  category: string
  created_at: string
}

const EXHIBITOR_CATEGORIES = [
  'technology',
  'healthcare',
  'education',
  'finance',
  'retail',
  'manufacturing',
  'agriculture',
  'energy',
  'transportation',
  'construction',
  'telecommunications',
  'media',
  'other'
] as const

export default function AdminExhibitors() {
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedExhibitors, setSelectedExhibitors] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    booth_number: '',
    category: '',
    logo: null as File | null
  })

  useEffect(() => {
    fetchExhibitors()
  }, [debouncedSearch, selectedCategory])

  const fetchExhibitors = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('exhibitors')
        .select('*')

      if (debouncedSearch) {
        query = query.or(`name.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%,booth_number.ilike.%${debouncedSearch}%`)
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query.order('name', { ascending: true })

      if (error) throw error
      setExhibitors(data || [])
    } catch (err) {
      console.error('Error fetching exhibitors:', err)
      setError(err instanceof Error ? err.message : 'Failed to load exhibitors')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.booth_number.trim()) {
      errors.booth_number = 'Booth number is required'
    }

    if (!formData.category) {
      errors.category = 'Category is required'
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

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, logo: 'Logo must be less than 5MB' }))
        return
      }
      setFormData(prev => ({ ...prev, logo: file }))
      setFormErrors(prev => ({ ...prev, logo: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      let logoUrl = selectedExhibitor?.logo_url

      if (formData.logo) {
        try {
          const { data: buckets } = await supabase.storage.listBuckets()
          const exhibitorsBucket = buckets?.find(b => b.name === 'exhibitors')
          
          if (!exhibitorsBucket) {
            const { error: createBucketError } = await supabase.storage.createBucket('exhibitors', {
              public: true,
              fileSizeLimit: 5242880,
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            })
            
            if (createBucketError) throw createBucketError
          }

          const timestamp = new Date().getTime()
          const fileExt = formData.logo.name.split('.').pop()
          const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('exhibitors')
            .upload(fileName, formData.logo, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from('exhibitors')
            .getPublicUrl(fileName)

          logoUrl = publicUrl

          if (selectedExhibitor?.logo_url) {
            const oldFileName = selectedExhibitor.logo_url.split('/').pop()
            if (oldFileName) {
              await supabase.storage
                .from('exhibitors')
                .remove([oldFileName])
            }
          }
        } catch (err) {
          throw new Error(`Logo upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }

      if (selectedExhibitor) {
        const { error: updateError } = await supabase
          .from('exhibitors')
          .update({
            name: formData.name,
            description: formData.description,
            website: formData.website,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            booth_number: formData.booth_number,
            category: formData.category,
            logo_url: logoUrl
          })
          .eq('id', selectedExhibitor.id)

        if (updateError) throw updateError
        setSuccessMessage('Exhibitor updated successfully')
      } else {
        const { error: insertError } = await supabase
          .from('exhibitors')
          .insert([{
            name: formData.name,
            description: formData.description,
            website: formData.website,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            booth_number: formData.booth_number,
            category: formData.category,
            logo_url: logoUrl
          }])

        if (insertError) throw insertError
        setSuccessMessage('Exhibitor added successfully')
      }

      await fetchExhibitors()
      resetForm()
    } catch (err) {
      console.error('Error saving exhibitor:', err)
      setError(err instanceof Error ? err.message : 'Failed to save exhibitor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exhibitor?')) return

    try {
      const { data: exhibitor, error: fetchError } = await supabase
        .from('exhibitors')
        .select('logo_url')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      if (exhibitor?.logo_url) {
        const fileName = exhibitor.logo_url.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from('exhibitors')
            .remove([fileName])
        }
      }

      const { error: deleteError } = await supabase
        .from('exhibitors')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      await fetchExhibitors()
      setSuccessMessage('Exhibitor deleted successfully')
    } catch (err) {
      console.error('Error deleting exhibitor:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete exhibitor')
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedExhibitors.size} exhibitors?`)) return

    try {
      const { error: deleteError } = await supabase
        .from('exhibitors')
        .delete()
        .in('id', Array.from(selectedExhibitors))

      if (deleteError) throw deleteError

      await fetchExhibitors()
      setSelectedExhibitors(new Set())
      setSuccessMessage(`${selectedExhibitors.size} exhibitors deleted successfully`)
    } catch (err) {
      console.error('Error deleting exhibitors:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete exhibitors')
    }
  }

  const handleBulkUpdate = async (updates: Partial<Exhibitor>) => {
    if (!confirm(`Are you sure you want to update ${selectedExhibitors.size} exhibitors?`)) return

    try {
      const { error: updateError } = await supabase
        .from('exhibitors')
        .update(updates)
        .in('id', Array.from(selectedExhibitors))

      if (updateError) throw updateError

      await fetchExhibitors()
      setSelectedExhibitors(new Set())
      setSuccessMessage(`${selectedExhibitors.size} exhibitors updated successfully`)
    } catch (err) {
      console.error('Error updating exhibitors:', err)
      setError(err instanceof Error ? err.message : 'Failed to update exhibitors')
    }
  }

  const handleExport = () => {
    const data = exhibitors.map(exhibitor => ({
      Name: exhibitor.name,
      Description: exhibitor.description,
      Website: exhibitor.website,
      Email: exhibitor.email,
      Phone: exhibitor.phone,
      Address: exhibitor.address,
      'Booth Number': exhibitor.booth_number,
      Category: exhibitor.category,
      'Created At': new Date(exhibitor.created_at).toLocaleString()
    }))

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `exhibitors-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleEdit = (exhibitor: Exhibitor) => {
    setSelectedExhibitor(exhibitor)
    setFormData({
      name: exhibitor.name,
      description: exhibitor.description,
      website: exhibitor.website,
      email: exhibitor.email,
      phone: exhibitor.phone,
      address: exhibitor.address,
      booth_number: exhibitor.booth_number,
      category: exhibitor.category,
      logo: null
    })
    setFormErrors({})
  }

  const resetForm = () => {
    setSelectedExhibitor(null)
    setFormData({
      name: '',
      description: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      booth_number: '',
      category: '',
      logo: null
    })
    setFormErrors({})
  }

  const toggleExhibitorSelection = (id: string) => {
    const newSelection = new Set(selectedExhibitors)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedExhibitors(newSelection)
  }

  const toggleAllSelection = () => {
    if (selectedExhibitors.size === exhibitors.length) {
      setSelectedExhibitors(new Set())
    } else {
      setSelectedExhibitors(new Set(exhibitors.map(e => e.id)))
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
          <h1 className="text-3xl font-bold text-gray-900">Exhibitor Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add and manage exhibitors for your events.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search exhibitors..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Filter className="w-4 h-4 inline-block mr-2" />
                Filters
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Download className="w-4 h-4 inline-block mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">All Categories</option>
                        {EXHIBITOR_CATEGORIES.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions */}
        {selectedExhibitors.size > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  {selectedExhibitors.size} exhibitors selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkUpdate({ category: 'technology' })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Update Category
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedExhibitor ? 'Edit Exhibitor' : 'Add New Exhibitor'}
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
                  onChange={e => {
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                    setFormErrors(prev => ({ ...prev, name: '' }))
                  }}
                  className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, category: e.target.value }))
                    setFormErrors(prev => ({ ...prev, category: '' }))
                  }}
                  className={`w-full px-3 py-2 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                >
                  <option value="">Select a category</option>
                  {EXHIBITOR_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>
                )}
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
                  onChange={e => {
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                    setFormErrors(prev => ({ ...prev, email: '' }))
                  }}
                  className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }))
                    setFormErrors(prev => ({ ...prev, phone: '' }))
                  }}
                  className={`w-full px-3 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                )}
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
                  onChange={e => {
                    setFormData(prev => ({ ...prev, website: e.target.value }))
                    setFormErrors(prev => ({ ...prev, website: '' }))
                  }}
                  className={`w-full px-3 py-2 border ${formErrors.website ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                {formErrors.website && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.website}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booth Number
                </label>
                <input
                  type="text"
                  value={formData.booth_number}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, booth_number: e.target.value }))
                    setFormErrors(prev => ({ ...prev, booth_number: '' }))
                  }}
                  className={`w-full px-3 py-2 border ${formErrors.booth_number ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                />
                {formErrors.booth_number && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.booth_number}</p>
                )}
              </div>
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
              {formErrors.logo && (
                <p className="mt-1 text-sm text-red-500">{formErrors.logo}</p>
              )}
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
            <div className="flex justify-end space-x-3">
              {selectedExhibitor && (
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
                ) : selectedExhibitor ? (
                  'Update Exhibitor'
                ) : (
                  'Add Exhibitor'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Exhibitors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitors.map((exhibitor) => (
            <motion.div
              key={exhibitor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedExhibitors.has(exhibitor.id)}
                      onChange={() => toggleExhibitorSelection(exhibitor.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">
                      {exhibitor.name}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(exhibitor)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exhibitor.id)}
                      className="p-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="aspect-[16/9] relative bg-gray-100">
                <img
                  src={exhibitor.logo_url}
                  alt={exhibitor.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Booth {exhibitor.booth_number}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {exhibitor.category.charAt(0).toUpperCase() + exhibitor.category.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {exhibitor.description}
                </p>
                <div className="space-y-2">
                  {exhibitor.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {exhibitor.email}
                    </div>
                  )}
                  {exhibitor.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {exhibitor.phone}
                    </div>
                  )}
                  {exhibitor.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      {exhibitor.website}
                    </div>
                  )}
                  {exhibitor.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {exhibitor.address}
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