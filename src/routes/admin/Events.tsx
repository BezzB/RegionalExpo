import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Edit2, Calendar, MapPin, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  image_url: string | null
  status: 'upcoming' | 'ongoing' | 'past'
  event_type: 'conference' | 'workshop' | 'gala' | 'marathon'
  registration_url: string | null
  created_at: string
  updated_at: string
}

interface EventFormData {
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  image_url: string | null
  status: 'upcoming' | 'ongoing' | 'past'
  event_type: 'conference' | 'workshop' | 'gala' | 'marathon'
  registration_url: string | null
}

const ITEMS_PER_PAGE = 6

export default function AdminEvents() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    image_url: null,
    status: 'upcoming',
    event_type: 'conference',
    registration_url: null
  })

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/admin/login')
      }
    }
    checkAuth()
  }, [navigate])

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/admin/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  // Fetch events with pagination
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events', page],
    queryFn: async () => {
      const from = (page - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .order('start_date', { ascending: true })
        .range(from, to)

      if (error) throw error
      return { data, count }
    }
  })

  // Create/Update event mutation
  const mutation = useMutation({
    mutationFn: async (data: {
      title: string
      description: string
      start_date: string
      end_date: string
      location: string
      image_url: string | null
      status: 'upcoming' | 'ongoing' | 'past'
      event_type: 'conference' | 'workshop' | 'gala' | 'marathon'
      registration_url: string | null
      id?: string
    }) => {
      let imageUrl = selectedEvent?.image_url

      // First insert/update the event to get the ID
      const eventData = {
        title: data.title,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location,
        image_url: imageUrl,
        status: data.status,
        event_type: data.event_type,
        registration_url: data.registration_url
      }

      let eventId: string

      if (selectedEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', selectedEvent.id)
          .select()
          .single()
        if (error) throw error
        eventId = selectedEvent.id
      } else {
        const { data: newEvent, error } = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single()
        if (error) throw error
        eventId = newEvent.id
      }

      // Then handle image upload if there's a new image
      if (data.image_url && data.image_url !== imageUrl) {
        try {
          const fileExt = data.image_url.split('.').pop()
          const fileName = `${eventId}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('event-media')
            .upload(`images/${fileName}`, data.image_url, {
              cacheControl: '3600',
              upsert: true
            })

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from('event-media')
            .getPublicUrl(`images/${fileName}`)

          // Update the event with the new image URL
          const { error: updateError } = await supabase
            .from('events')
            .update({ image_url: publicUrl })
            .eq('id', eventId)

          if (updateError) throw updateError
        } catch (error) {
          console.error('Error uploading image:', error)
          throw new Error('Failed to upload image')
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      resetForm()
    },
    onError: (error) => {
      console.error('Error saving event:', error)
      setError(error instanceof Error ? error.message : 'Failed to save event')
    }
  })

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, GIF, and WebP images are allowed')
        return
      }

      // Generate a unique filename with timestamp
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets()
      const eventMediaBucket = buckets?.find(b => b.name === 'event-media')
      
      if (!eventMediaBucket) {
        const { error: createBucketError } = await supabase.storage.createBucket('event-media', {
          public: true,
          fileSizeLimit: 5242880,
          allowedMimeTypes: allowedTypes
        })
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError)
          setError('Failed to create storage bucket')
          return
        }
      }

      // Upload the file to event-media bucket
      const { error: uploadError } = await supabase.storage
        .from('event-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Error uploading:', uploadError)
        setError(`Upload failed: ${uploadError.message}`)
        return
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('event-media')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
    } catch (error) {
      console.error('Error handling image:', error)
      setError(error instanceof Error ? error.message : 'Failed to process image')
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toISOString().split('.')[0] // Remove milliseconds and add Z for UTC
      }

      const submitData = {
        ...formData,
        start_date: formatDate(formData.start_date),
        end_date: formatDate(formData.end_date)
      }

      if (selectedEvent) {
        await mutation.mutateAsync(submitData)
      } else {
        await mutation.mutateAsync(submitData)
      }
    } catch (error) {
      console.error('Error saving event:', error)
      setError(error instanceof Error ? error.message : 'Failed to save event')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    await deleteMutation.mutateAsync(id)
  }

  const handleEdit = (event: Event) => {
    setSelectedEvent(event)
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toISOString().split('.')[0] // Remove milliseconds
    }
    
    setFormData({
      ...event,
      start_date: formatDate(event.start_date),
      end_date: formatDate(event.end_date)
    })
  }

  const resetForm = () => {
    setSelectedEvent(null)
    setFormData({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      location: '',
      image_url: null,
      status: 'upcoming',
      event_type: 'conference',
      registration_url: null
    })
  }

  const totalPages = eventsData?.count ? Math.ceil(eventsData.count / ITEMS_PER_PAGE) : 0

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create and manage events, set dates, locations, and capacity.
          </p>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedEvent ? 'Edit Event' : 'Add New Event'}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image
              </label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <span className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    {formData.image_url ? 'Change Image' : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                {formData.image_url && (
                  <span className="ml-3 text-sm text-gray-500">
                    {formData.title}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'upcoming' | 'ongoing' | 'past' }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="past">Past</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={formData.event_type}
                  onChange={e => setFormData(prev => ({ ...prev, event_type: e.target.value as 'conference' | 'workshop' | 'gala' | 'marathon' }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="gala">Gala</option>
                  <option value="marathon">Marathon</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration URL
              </label>
              <input
                type="url"
                value={formData.registration_url || ''}
                onChange={e => setFormData(prev => ({ ...prev, registration_url: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              {selectedEvent && (
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
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {selectedEvent ? 'Updating...' : 'Creating...'}
                  </div>
                ) : selectedEvent ? (
                  'Update Event'
                ) : (
                  'Add Event'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsData?.data.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="aspect-[16/9] relative">
                <img
                  src={event.image_url || ''}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {event.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </p>
                <span className="mt-2 inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                  {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 