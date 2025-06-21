import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import supabase from '../../lib/supabase'
import { 
  Plus, Trash2, Edit2, Loader2, Mail, Phone, User, Calendar, 
  Search, Filter, Download, CheckSquare, Square, AlertCircle, X,
  Building2, MapPin, Tag
} from 'lucide-react'
import { validateEmail, validatePhone } from '../../utils/validation'
import { useDebounce } from '../../hooks/useDebounce'

interface Attendee {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  job_title: string
  address: string
  ticket_type: string
  registration_date: string
  created_at: string
}

const TICKET_TYPES = [
  'general',
  'vip',
  'student',
  'speaker',
  'sponsor',
  'exhibitor',
  'press',
  'other'
] as const

export default function AdminAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicketType, setSelectedTicketType] = useState<string>('')
  const [selectedAttendees, setSelectedAttendees] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const debouncedSearch = useDebounce(searchQuery, 300)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
    address: '',
    ticket_type: '',
    registration_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchAttendees()
  }, [debouncedSearch, selectedTicketType])

  const fetchAttendees = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('attendees')
        .select('*')

      if (debouncedSearch) {
        query = query.or(`first_name.ilike.%${debouncedSearch}%,last_name.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%,company.ilike.%${debouncedSearch}%`)
      }

      if (selectedTicketType) {
        query = query.eq('ticket_type', selectedTicketType)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setAttendees(data || [])
    } catch (err) {
      console.error('Error fetching attendees:', err)
      setError(err instanceof Error ? err.message : 'Failed to load attendees')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Invalid email address'
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Invalid phone number'
    }

    if (!formData.ticket_type) {
      errors.ticket_type = 'Ticket type is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (selectedAttendee) {
        const { error: updateError } = await supabase
          .from('attendees')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            job_title: formData.job_title,
            address: formData.address,
            ticket_type: formData.ticket_type,
            registration_date: formData.registration_date
          })
          .eq('id', selectedAttendee.id)

        if (updateError) throw updateError
        setSuccessMessage('Attendee updated successfully')
      } else {
        const { error: insertError } = await supabase
          .from('attendees')
          .insert([{
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            job_title: formData.job_title,
            address: formData.address,
            ticket_type: formData.ticket_type,
            registration_date: formData.registration_date
          }])

        if (insertError) throw insertError
        setSuccessMessage('Attendee added successfully')
      }

      await fetchAttendees()
      resetForm()
    } catch (err) {
      console.error('Error saving attendee:', err)
      setError(err instanceof Error ? err.message : 'Failed to save attendee')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendee?')) return

    try {
      const { error: deleteError } = await supabase
        .from('attendees')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      await fetchAttendees()
      setSuccessMessage('Attendee deleted successfully')
    } catch (err) {
      console.error('Error deleting attendee:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete attendee')
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedAttendees.size} attendees?`)) return

    try {
      const { error: deleteError } = await supabase
        .from('attendees')
        .delete()
        .in('id', Array.from(selectedAttendees))

      if (deleteError) throw deleteError

      await fetchAttendees()
      setSelectedAttendees(new Set())
      setSuccessMessage(`${selectedAttendees.size} attendees deleted successfully`)
    } catch (err) {
      console.error('Error deleting attendees:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete attendees')
    }
  }

  const handleBulkUpdate = async (updates: Partial<Attendee>) => {
    if (!confirm(`Are you sure you want to update ${selectedAttendees.size} attendees?`)) return

    try {
      const { error: updateError } = await supabase
        .from('attendees')
        .update(updates)
        .in('id', Array.from(selectedAttendees))

      if (updateError) throw updateError

      await fetchAttendees()
      setSelectedAttendees(new Set())
      setSuccessMessage(`${selectedAttendees.size} attendees updated successfully`)
    } catch (err) {
      console.error('Error updating attendees:', err)
      setError(err instanceof Error ? err.message : 'Failed to update attendees')
    }
  }

  const handleExport = () => {
    const data = attendees.map(attendee => ({
      'First Name': attendee.first_name,
      'Last Name': attendee.last_name,
      'Email': attendee.email,
      'Phone': attendee.phone,
      'Company': attendee.company,
      'Job Title': attendee.job_title,
      'Address': attendee.address,
      'Ticket Type': attendee.ticket_type,
      'Registration Date': new Date(attendee.registration_date).toLocaleDateString(),
      'Created At': new Date(attendee.created_at).toLocaleString()
    }))

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `attendees-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleEdit = (attendee: Attendee) => {
    setSelectedAttendee(attendee)
    setFormData({
      first_name: attendee.first_name,
      last_name: attendee.last_name,
      email: attendee.email,
      phone: attendee.phone,
      company: attendee.company,
      job_title: attendee.job_title,
      address: attendee.address,
      ticket_type: attendee.ticket_type,
      registration_date: attendee.registration_date
    })
    setFormErrors({})
  }

  const resetForm = () => {
    setSelectedAttendee(null)
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      job_title: '',
      address: '',
      ticket_type: '',
      registration_date: new Date().toISOString().split('T')[0]
    })
    setFormErrors({})
  }

  const toggleAttendeeSelection = (id: string) => {
    const newSelection = new Set(selectedAttendees)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedAttendees(newSelection)
  }

  const toggleAllSelection = () => {
    if (selectedAttendees.size === attendees.length) {
      setSelectedAttendees(new Set())
    } else {
      setSelectedAttendees(new Set(attendees.map(a => a.id)))
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
          <h1 className="text-3xl font-bold text-gray-900">Attendee Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add and manage event attendees.
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
                  placeholder="Search attendees..."
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
                        Ticket Type
                      </label>
                      <select
                        value={selectedTicketType}
                        onChange={e => setSelectedTicketType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">All Ticket Types</option>
                        {TICKET_TYPES.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
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
        {selectedAttendees.size > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  {selectedAttendees.size} attendees selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkUpdate({ ticket_type: 'vip' })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Update Ticket Type
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
            {selectedAttendee ? 'Edit Attendee' : 'Add New Attendee'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, first_name: e.target.value }))
                    setFormErrors(prev => ({ ...prev, first_name: '' }))
                  }}
                  className={`w-full px-3 py-2 border ${formErrors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                />
                {formErrors.first_name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.first_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, last_name: e.target.value }))
                    setFormErrors(prev => ({ ...prev, last_name: '' }))
                  }}
                  className={`w-full px-3 py-2 border ${formErrors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                />
                {formErrors.last_name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.last_name}</p>
                )}
              </div>
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
                  required
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
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={e => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Type
                </label>
                <select
                  value={formData.ticket_type}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, ticket_type: e.target.value }))
                    setFormErrors(prev => ({ ...prev, ticket_type: '' }))
                  }}
                  className={`w-full px-3 py-2 border ${formErrors.ticket_type ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                  required
                >
                  <option value="">Select a ticket type</option>
                  {TICKET_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                {formErrors.ticket_type && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.ticket_type}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Date
                </label>
                <input
                  type="date"
                  value={formData.registration_date}
                  onChange={e => setFormData(prev => ({ ...prev, registration_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
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
            <div className="flex justify-end space-x-3">
              {selectedAttendee && (
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
                ) : selectedAttendee ? (
                  'Update Attendee'
                ) : (
                  'Add Attendee'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Attendees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendees.map((attendee) => (
            <motion.div
              key={attendee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.has(attendee.id)}
                      onChange={() => toggleAttendeeSelection(attendee.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">
                      {attendee.first_name} {attendee.last_name}
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(attendee)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(attendee.id)}
                      className="p-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {attendee.ticket_type.charAt(0).toUpperCase() + attendee.ticket_type.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(attendee.registration_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-2">
                  {attendee.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {attendee.email}
                    </div>
                  )}
                  {attendee.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {attendee.phone}
                    </div>
                  )}
                  {attendee.company && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      {attendee.company}
                    </div>
                  )}
                  {attendee.job_title && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {attendee.job_title}
                    </div>
                  )}
                  {attendee.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {attendee.address}
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
