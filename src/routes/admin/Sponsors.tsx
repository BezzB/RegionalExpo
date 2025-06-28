import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '@/lib/supabase'
import { 
  Plus, Trash2, Edit2, Loader2, Globe, Mail, Phone, Building2,
  Users, CreditCard, Image, AlertCircle, Search, Filter, Download
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { useDebounce } from '@/hooks/useDebounce'
import { validateEmail, validatePhone, validateUrl } from '@/utils/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SponsorRegistration {
  id: string
  created_at: string
  company_name: string
  company_website: string
  country: string
  organization_type: string
  company_logo_url: string | null
  contact_name: string
  contact_job_title: string
  contact_email: string
  contact_phone: string
  package_id: string
  delegate_count: number
  delegate_names: string[]
  fascia_name: string
  social_media: {
    twitter: string
    facebook: string
    linkedin: string
    instagram: string
  }
  payment_status: string
  payment_amount: number | null
  payment_date: string | null
  payment_reference: string | null
  terms_accepted: boolean
  consent_given: boolean
}

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<SponsorRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    fetchSponsors()
  }, [debouncedSearch, selectedPackage, selectedPaymentStatus])

  const fetchSponsors = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('registrations')
        .select('*')

      if (debouncedSearch) {
        query = query.or(`company_name.ilike.%${debouncedSearch}%,contact_name.ilike.%${debouncedSearch}%,contact_email.ilike.%${debouncedSearch}%`)
      }

      if (selectedPackage && selectedPackage !== 'all') {
        query = query.eq('package_id', selectedPackage)
      }

      if (selectedPaymentStatus && selectedPaymentStatus !== 'all') {
        query = query.eq('payment_status', selectedPaymentStatus)
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setSponsors(data || [])
    } catch (err) {
      console.error('Error fetching sponsors:', err)
      setError(err instanceof Error ? err.message : 'Failed to load sponsors')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePaymentStatus = async (id: string, status: string) => {
    try {
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ payment_status: status })
        .eq('id', id)

      if (updateError) throw updateError
      await fetchSponsors()
      toast({
        title: 'Payment Status Updated',
        description: 'Sponsor payment status has been updated successfully.',
      })
    } catch (err) {
      console.error('Error updating payment status:', err)
      toast({
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'Failed to update payment status',
        variant: 'destructive',
      })
    }
  }

  const handleExport = () => {
    const csv = [
      ['Company Name', 'Contact Person', 'Email', 'Phone', 'Package', 'Delegates', 'Payment Status', 'Amount'],
      ...sponsors.map(sponsor => [
        sponsor.company_name,
        sponsor.contact_name,
        sponsor.contact_email,
        sponsor.contact_phone,
        sponsor.package_id,
        sponsor.delegate_count,
        sponsor.payment_status,
        sponsor.payment_amount || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sponsor-registrations.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold">Error Loading Sponsors</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sponsor Registrations</h1>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search sponsors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedPackage} onValueChange={setSelectedPackage}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by package" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Packages</SelectItem>
            <SelectItem value="platinum">Platinum</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="silver">Silver</SelectItem>
            <SelectItem value="bronze">Bronze</SelectItem>
            <SelectItem value="exhibition">Exhibition</SelectItem>
            <SelectItem value="cbo">CBO</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {sponsors.map((sponsor) => (
          <Card key={sponsor.id} className="p-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold">{sponsor.company_name}</h3>
                  <Badge>{sponsor.package_id}</Badge>
                  <Badge variant={sponsor.payment_status === 'completed' ? 'default' : 'secondary'}>
                    {sponsor.payment_status}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {sponsor.contact_email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {sponsor.contact_phone}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {sponsor.delegate_count} Delegates
                  </div>
                  {sponsor.payment_amount && (
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-1" />
                      KES {sponsor.payment_amount.toLocaleString()}
                    </div>
                  )}
                  {sponsor.company_website && (
                    <a 
                      href={sponsor.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-blue-600"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <Select
                  value={sponsor.payment_status}
                  onValueChange={(value) => handleUpdatePaymentStatus(sponsor.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Update Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 
