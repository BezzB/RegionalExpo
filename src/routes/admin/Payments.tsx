import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import supabase from '../../lib/supabase'
import { Loader2, Download, Search, Filter, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useDebounce } from '../../hooks/useDebounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { format } from 'date-fns'

interface Payment {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_organization: string
  customer_position: string
  package: {
    id: string
    name: string
    price: number
    currency: string
    description: string
  }
  amount: number
  currency: string
  payment_method: string
  mpesa_phone: string | null
  status: string
  payment_provider: string
  payment_metadata: {
    package_name: string
    package_description: string
    package_benefits: string[]
  }
  created_at: string
  updated_at: string
}

interface FilterOptions {
  search: string
  status: string
  package: string
  dateRange: string
}

const PAYMENT_STATUS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'processing', label: 'Processing', color: 'blue' },
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
    status: 'all',
    package: 'all',
    dateRange: ''
  })
  const debouncedSearch = useDebounce(filters.search, 300)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          package:payment_packages(
            id,
            name,
            price,
            currency,
            description
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (err) {
      console.error('Error fetching payments:', err)
      setError(err instanceof Error ? err.message : 'Failed to load payments')
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    try {
      const csvData = [
        [
          'Date',
          'Customer Name',
          'Email',
          'Phone',
          'Organization',
          'Position',
          'Package',
          'Amount',
          'Payment Method',
          'Status',
          'Provider',
          'M-Pesa Phone'
        ],
        ...filteredPayments.map(payment => [
          format(new Date(payment.created_at), 'yyyy-MM-dd HH:mm:ss'),
          payment.customer_name,
          payment.customer_email,
          payment.customer_phone,
          payment.customer_organization,
          payment.customer_position,
          payment.package.name,
          `${payment.currency} ${payment.amount}`,
          payment.payment_method,
          payment.status,
          payment.payment_provider,
          payment.mpesa_phone || ''
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

  const handleStatusUpdate = async (paymentId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true)
      
      const { data, error } = await supabase
        .rpc('update_payment_status', {
          payment_id: paymentId,
          new_status: newStatus
        })

      if (error) throw error
      if (!data.success) throw new Error(data.message)

      // Update local state
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: newStatus, updated_at: new Date().toISOString() }
          : payment
      ))

      toast.success('Payment status updated successfully')
      setIsUpdateDialogOpen(false)
      setSelectedPayment(null)
      setNewStatus('')
    } catch (err) {
      console.error('Error updating payment status:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to update payment status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const searchTerm = debouncedSearch.toLowerCase()
    const matchesSearch = 
      payment.customer_name.toLowerCase().includes(searchTerm) ||
      payment.customer_email.toLowerCase().includes(searchTerm) ||
      payment.customer_organization.toLowerCase().includes(searchTerm) ||
      payment.customer_phone.toLowerCase().includes(searchTerm) ||
      payment.mpesa_phone?.toLowerCase().includes(searchTerm)
    
    const matchesStatus = filters.status === 'all' || payment.status === filters.status
    const matchesPackage = filters.package === 'all' || (payment.package?.name === filters.package)
    
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
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {PAYMENT_STATUS.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select 
                value={filters.package} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, package: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  {Array.from(new Set(payments
                    .filter(p => p.package?.name)
                    .map(p => p.package.name)))
                    .map(name => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment, index) => (
                  <motion.tr 
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(payment.created_at), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.customer_email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.customer_organization}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.customer_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.package.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.payment_metadata.package_description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        className={`
                          ${payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${payment.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                          ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${payment.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                          ${payment.status === 'refunded' ? 'bg-purple-100 text-purple-800' : ''}
                        `}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.payment_method.toUpperCase()}
                      </div>
                      {payment.mpesa_phone && (
                        <div className="text-sm text-gray-500">
                          M-Pesa: {payment.mpesa_phone}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Provider: {payment.payment_provider}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => {
                          setSelectedPayment(payment)
                          setNewStatus(payment.status)
                          setIsUpdateDialogOpen(true)
                        }}
                        variant="outline"
                        className="text-sm"
                      >
                        Update Status
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Payment Status</DialogTitle>
              <DialogDescription>
                Update the status for payment from {selectedPayment?.customer_name}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Current Status</h4>
                  <Badge 
                    className={`
                      ${selectedPayment?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${selectedPayment?.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                      ${selectedPayment?.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${selectedPayment?.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                      ${selectedPayment?.status === 'refunded' ? 'bg-purple-100 text-purple-800' : ''}
                    `}
                  >
                    {selectedPayment?.status ? selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1) : ''}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">New Status</h4>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_STATUS.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Payment Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Amount: {selectedPayment?.currency} {selectedPayment?.amount.toLocaleString()}</p>
                    <p>Package: {selectedPayment?.package.name}</p>
                    <p>Payment Method: {selectedPayment?.payment_method.toUpperCase()}</p>
                    {selectedPayment?.mpesa_phone && (
                      <p>M-Pesa Phone: {selectedPayment?.mpesa_phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsUpdateDialogOpen(false)
                  setSelectedPayment(null)
                  setNewStatus('')
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedPayment && handleStatusUpdate(selectedPayment.id, newStatus)}
                disabled={!newStatus || newStatus === selectedPayment?.status || updatingStatus}
                className={`${
                  newStatus === 'completed' ? 'bg-green-600 hover:bg-green-700' :
                  newStatus === 'failed' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {updatingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* No results */}
        {filteredPayments.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No payments found</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
} 