import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import supabase from '../lib/supabase'

export interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  event_category: string
  created_at: string
}

interface GalleryContextType {
  items: GalleryItem[]
  loading: boolean
  error: string | null
  categories: string[]
  refreshGallery: () => Promise<void>
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined)

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGalleryItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching gallery items:', err)
      setError(err instanceof Error ? err.message : 'Failed to load gallery items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  const categories = ['all', ...new Set(items.map(item => item.event_category || 'uncategorized'))]

  const value = {
    items,
    loading,
    error,
    categories,
    refreshGallery: fetchGalleryItems
  }

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  )
}

export function useGallery() {
  const context = useContext(GalleryContext)
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider')
  }
  return context
} 