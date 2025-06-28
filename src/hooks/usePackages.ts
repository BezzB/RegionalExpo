import { useState, useEffect } from 'react'
import supabase from '@/lib/supabase'

interface Package {
  id: string
  name: string
  price: string | number
  currency: string
  description: string
  benefits: string[]
  slots: number | null
  featured: boolean
  reservationFee?: number
}

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('payment_packages')
          .select('*')
          .eq('active', true)
          .order('price', { ascending: false })

        if (error) throw error

        // Transform the data to match the frontend format
        const transformedPackages = data.map(pkg => ({
          id: pkg.id,
          name: pkg.name,
          price: pkg.price.toString(),
          currency: pkg.currency,
          description: pkg.description || '',
          benefits: Array.isArray(pkg.benefits) ? pkg.benefits : [],
          slots: pkg.slots,
          featured: pkg.featured,
          reservationFee: pkg.reservation_fee
        }))

        setPackages(transformedPackages)
      } catch (err) {
        console.error('Error fetching packages:', err)
        setError(err instanceof Error ? err.message : 'Failed to load packages')
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  return { packages, loading, error }
} 