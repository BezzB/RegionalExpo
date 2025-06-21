import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../App'
import { Plus, Trash2, Edit2, Loader2, Mail, Phone, Globe, Linkedin, Twitter } from 'lucide-react'

interface Speaker {
  id: string
  name: string
  title: string
  bio: string
  image_url: string
  email: string
  phone: string
  website: string
  linkedin: string
  twitter: string
  created_at: string
}

export default function AdminSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    twitter: '',
    image: null as File | null
  })

  const fetchSpeakers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('speakers')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setSpeakers(data || [])
    } catch (err) {
      console.error('Error fetching speakers:', err)
      setError(err instanceof Error ? err.message : 'Failed to load speakers')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let imageUrl = selectedSpeaker?.image_url

      if (formData.image) {
        try {
          // Check if bucket exists, if not create it
          const { data: buckets } = await supabase.storage.listBuckets()
          const speakersBucket = buckets?.find(b => b.name === 'speakers')
          
          if (!speakersBucket) {
            const { error: createBucketError } = await supabase.storage.createBucket('speakers', {
              public: true,
              fileSizeLimit: 5242880, // 5MB
              allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            })
            
            if (createBucketError) {
              throw new Error(`Failed to create speakers bucket: ${createBucketError.message}`)
            }
          }

          const timestamp = new Date().getTime()
          const fileExt = formData.image.name.split('.').pop()
          const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('speakers')
            .upload(fileName, formData.image, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            throw new Error(`Failed to upload image: ${uploadError.message}`)
          }

          const { data: { publicUrl } } = supabase.storage
            .from('speakers')
            .getPublicUrl(fileName)

          imageUrl = publicUrl

          if (selectedSpeaker?.image_url) {
            const oldFileName = selectedSpeaker.image_url.split('/').pop()
            if (oldFileName) {
              await supabase.storage
                .from('speakers')
                .remove([oldFileName])
            }
          }
        } catch (err) {
          console.error('Error handling image upload:', err)
          throw new Error(`Image upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }

      if (selectedSpeaker) {
        const { error: updateError } = await supabase
          .from('speakers')
          .update({
            name: formData.name,
            title: formData.title,
            bio: formData.bio,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            image_url: imageUrl
          })
          .eq('id', selectedSpeaker.id)

        if (updateError) {
          throw new Error(`Failed to update speaker: ${updateError.message}`)
        }
      } else {
        const { error: insertError } = await supabase
          .from('speakers')
          .insert([{
            name: formData.name,
            title: formData.title,
            bio: formData.bio,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            image_url: imageUrl
          }])

        if (insertError) {
          throw new Error(`Failed to create speaker: ${insertError.message}`)
        }
      }

      await fetchSpeakers()
      resetForm()
    } catch (err) {
      console.error('Error saving speaker:', err)
      setError(err instanceof Error ? err.message : 'Failed to save speaker')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this speaker?')) return

    try {
      const { data: speaker, error: fetchError } = await supabase
        .from('speakers')
        .select('image_url')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error(`Failed to fetch speaker: ${fetchError.message}`)
      }

      if (speaker?.image_url) {
        const fileName = speaker.image_url.split('/').pop()
        if (fileName) {
          const { error: deleteImageError } = await supabase.storage
            .from('speakers')
            .remove([fileName])

          if (deleteImageError) {
            console.error('Error deleting image:', deleteImageError)
          }
        }
      }

      const { error: deleteError } = await supabase
        .from('speakers')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(`Failed to delete speaker: ${deleteError.message}`)
      }

      await fetchSpeakers()
    } catch (err) {
      console.error('Error deleting speaker:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete speaker')
    }
  }

  const handleEdit = (speaker: Speaker) => {
    setSelectedSpeaker(speaker)
    setFormData({
      name: speaker.name,
      title: speaker.title,
      bio: speaker.bio,
      email: speaker.email,
      phone: speaker.phone,
      website: speaker.website,
      linkedin: speaker.linkedin,
      twitter: speaker.twitter,
      image: null
    })
  }

  const resetForm = () => {
    setSelectedSpeaker(null)
    setFormData({
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      website: '',
      linkedin: '',
      twitter: '',
      image: null
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
          <h1 className="text-3xl font-bold text-gray-900">Speaker Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Add and manage speakers for your events.
          </p>
        </div>

        {/* Add/Edit Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedSpeaker ? 'Edit Speaker' : 'Add New Speaker'}
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
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={e => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={e => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Speaker Image
              </label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <span className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    {formData.image ? 'Change Image' : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                {formData.image && (
                  <span className="ml-3 text-sm text-gray-500">
                    {formData.image.name}
                  </span>
                )}
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <div className="flex justify-end space-x-3">
              {selectedSpeaker && (
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
                ) : selectedSpeaker ? (
                  'Update Speaker'
                ) : (
                  'Add Speaker'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map((speaker) => (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="aspect-square relative">
                <img
                  src={speaker.image_url}
                  alt={speaker.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(speaker)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(speaker.id)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {speaker.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {speaker.title}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {speaker.bio}
                </p>
                <div className="space-y-2">
                  {speaker.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {speaker.email}
                    </div>
                  )}
                  {speaker.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {speaker.phone}
                    </div>
                  )}
                  {speaker.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      {speaker.website}
                    </div>
                  )}
                  {speaker.linkedin && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Linkedin className="w-4 h-4 mr-2" />
                      {speaker.linkedin}
                    </div>
                  )}
                  {speaker.twitter && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Twitter className="w-4 h-4 mr-2" />
                      {speaker.twitter}
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