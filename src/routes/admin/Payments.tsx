import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import { Loader2, Download, Search, Filter, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useDebounce } from '../../hooks/useDebounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Payment {
  id: string
  customer: {
    full_name: string
    email: string
    company: string
  }
  package: {
    name: string
    price: number
    currency: string
  }
  status: string
  amount_paid: number
  payment_method: string
  payment_reference: string
  mpesa_phone: string
  transaction_id: string
  created_at: string
}

interface FilterOptions {
  search: string
  status: string
  package: string
  dateRange: string
}

const PAYMENT_STATUS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'failed', label: 'Failed', color: 'red' },
  { value: 'refunded', label: 'Refunded', color: 'purple' }
]

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: '',
    package: '',
    dateRange: ''
  })
  const debouncedSearch = useDebounce(filters.search, 300)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          customer:customers(full_name, email, company),
          package:payment_packages(name, price, currency)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (err) {
      console.error('Error fetching payments:', err)
      setError(err instanceof Error ? err.message : 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    try {
      const csvData = [
        ['Date', 'Customer', 'Email', 'Company', 'Package', 'Amount', 'Status', 'Reference', 'Transaction ID'],
        ...filteredPayments.map(payment => [
          format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm:ss'),
          payment.customer.full_name,
          payment.customer.email,
          payment.customer.company,
          payment.package.name,
          `${payment.package.currency} ${payment.amount_paid}`,
          payment.status,
          payment.payment_reference,
          payment.transaction_id
        ])
      ]
      .map(row => row.join(','))
      .join('\n')

      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payments-${format(new Date(), 'yyyy-MM-dd')}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error exporting payments:', err)
      toast.error('Failed to export payments')
    }
  }

  const filteredPayments = payments.filter(payment => {
    const searchTerm = debouncedSearch.toLowerCase()
    const matchesSearch = 
      payment.customer.full_name.toLowerCase().includes(searchTerm) ||
      payment.customer.email.toLowerCase().includes(searchTerm) ||
      payment.customer.company?.toLowerCase().includes(searchTerm) ||
      payment.payment_reference?.toLowerCase().includes(searchTerm) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm)
    
    const matchesStatus = !filters.status || payment.status === filters.status
    const matchesPackage = !filters.package || (payment.package?.name === filters.package)
    
    // Date range filtering can be added here if needed
    
    return matchesSearch && matchesStatus && matchesPackage
  })

  useEffect(() => {
    fetchPayments()
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              View and manage all payment transactions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleExport}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              onClick={fetchPayments}
              className="flex items-center gap-2"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search payments..."
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full"
                startAdornment={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>
            <div>
              <Select
                value={filters.status}
                onValueChange={value => setFilters(prev => ({ ...prev, status: value }))}
              >
                <option value="" disabled>Filter by status</option>
                {PAYMENT_STATUS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Select
                value={filters.package}
                onValueChange={value => setFilters(prev => ({ ...prev, package: value }))}
              >
                <option value="" disabled>Filter by package</option>
                {Array.from(new Set(payments.filter(p => p.package).map(p => p.package.name))).map(name => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Payments List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map(payment => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(payment.created_at), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.customer.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.customer.email}
                      </div>
                      {payment.customer.company && (
                        <div className="text-sm text-gray-500">
                          {payment.customer.company}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.package?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.package ? `${payment.package.currency} ${payment.amount_paid}` : `${payment.amount_paid}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.payment_reference || payment.transaction_id || '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 