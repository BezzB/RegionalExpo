import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../App'
import { useGallery, GalleryItem } from '../../context/GalleryContext'
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Edit2, 
  Loader2,
  X
} from 'lucide-react'

export default function AdminGallery() {
  const { items: galleryItems, loading, error: contextError, refreshGallery } = useGallery()
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null as File | null
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image) {
      setError('Please select an image')
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // Validate file size
      if (formData.image.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(formData.image.type)) {
        setError('Only JPG, PNG, GIF, and WebP images are allowed')
        return
      }

      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets()
      const galleryBucket = buckets?.find(b => b.name === 'gallery')
      
      if (!galleryBucket) {
        const { error: createBucketError } = await supabase.storage.createBucket('gallery', {
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

      // Upload image to Supabase Storage
      const fileExt = formData.image.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `gallery/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, formData.image)

      if (uploadError) {
        console.error('Error uploading:', uploadError)
        setError(`Upload failed: ${uploadError.message}`)
        return
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      // Create gallery item in database
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            event_category: formData.category,
            image_url: publicUrl
          }
        ])

      if (dbError) {
        console.error('Database error:', dbError)
        setError(`Failed to save to database: ${dbError.message}`)
        return
      }

      // Reset form and refresh gallery
      setFormData({
        title: '',
        description: '',
        category: '',
        image: null
      })
      await refreshGallery()
    } catch (err) {
      console.error('Error uploading image:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)

      if (error) throw error

      await refreshGallery()
    } catch (err) {
      console.error('Error deleting item:', err)
      setError('Failed to delete item')
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
    <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="mt-2 text-sm text-gray-600">
          Upload and manage images for your gallery.
          </p>
        </div>

      {/* Upload Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {selectedItem ? 'Edit Image' : 'Upload New Image'}
          </h2>

        {(error || contextError) && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error || contextError}
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
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
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

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="mx-auto h-32 w-auto object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                      className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                      >
                        <span>Upload a file</span>
                  <input
                          id="image-upload"
                    type="file"
                          className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isUploading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading...
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4 inline-block mr-2" />
                  {selectedItem ? 'Update Image' : 'Upload Image'}
                </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
            <div className="aspect-[16/9] relative">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                  onClick={() => setSelectedItem(item)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.description}
                </p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {item.event_category}
                </span>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  )
}