import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog'
import { AlertCircle, CheckCircle2, CreditCard } from 'lucide-react'
import supabase from '@/lib/supabase'
import { validateEmail, validatePhone } from '@/utils/validation'
import { toast } from 'react-hot-toast'

interface PaymentFormProps {
  selectedPackage: {
    id: string
    name: string
    price: string | number
    currency: string
    description: string
    benefits: string[]
  } | null
  onClose: () => void
  onSuccess: () => void
}

export function PaymentForm({ selectedPackage, onClose, onSuccess }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    paymentMethod: 'mpesa' as 'mpesa' | 'bank',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.company) {
      newErrors.company = 'Company name is required'
    }

    if (!formData.position) {
      newErrors.position = 'Position is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !selectedPackage) return

    setIsSubmitting(true)
    setPaymentStatus('processing')

    try {
      // Convert price to number if it's a string
      const amount = typeof selectedPackage.price === 'string' 
        ? parseFloat(selectedPackage.price.replace(/,/g, ''))
        : selectedPackage.price

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          customer_name: formData.fullName,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_organization: formData.company,
          customer_position: formData.position,
          package_id: selectedPackage.id,
          amount: amount,
          currency: selectedPackage.currency,
          payment_method: formData.paymentMethod,
          mpesa_phone: formData.paymentMethod === 'mpesa' ? formData.phone : null,
          status: 'pending',
          payment_provider: formData.paymentMethod === 'mpesa' ? 'mpesa' : 'bank',
          payment_metadata: {
            package_name: selectedPackage.name,
            package_description: selectedPackage.description,
            package_benefits: selectedPackage.benefits
          }
        })
        .select()
        .single()

      if (paymentError) {
        console.error('Payment creation error:', paymentError)
        if (paymentError.code === '42501') {
          throw new Error('Permission denied. Please try again.')
        } else if (paymentError.code === '23503') {
          throw new Error('Selected package is no longer available.')
        } else if (paymentError.message?.includes('duplicate key')) {
          throw new Error('A payment record already exists for this transaction.')
        }
        throw new Error('Failed to create payment record. Please try again.')
      }

      if (!payment) {
        throw new Error('No payment record was created. Please try again.')
      }

      // For demo purposes, we'll simulate a successful payment
      setTimeout(() => {
        setPaymentStatus('success')
        onSuccess()
      }, 2000)

    } catch (error) {
      console.error('Payment processing error:', error)
      setPaymentStatus('error')
      toast.error(error instanceof Error ? error.message : 'Failed to process payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={!!selectedPackage} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Sponsorship</DialogTitle>
          <DialogDescription>
            Fill in your details to process your sponsorship payment for {selectedPackage?.name}.
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === 'success' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Initiated Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              We've received your sponsorship request. Our team will contact you shortly with next steps.
            </p>
            <Button onClick={onClose}>Close</Button>
          </motion.div>
        ) : paymentStatus === 'error' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Processing Error
            </h3>
            <p className="text-gray-600 mb-6">
              We encountered an error while processing your payment. Please try again or contact support.
            </p>
            <Button onClick={() => setPaymentStatus('idle')}>Try Again</Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {selectedPackage && (
              <Card className="p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPackage.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPackage.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg">
                    {selectedPackage.currency} {typeof selectedPackage.price === 'number' 
                      ? selectedPackage.price.toLocaleString()
                      : selectedPackage.price}
                  </Badge>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className={errors.company ? 'border-red-500' : ''}
                />
                {errors.company && <p className="text-sm text-red-500 mt-1">{errors.company}</p>}
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className={errors.position ? 'border-red-500' : ''}
                />
                {errors.position && <p className="text-sm text-red-500 mt-1">{errors.position}</p>}
              </div>

              <div>
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Button
                    type="button"
                    variant={formData.paymentMethod === 'mpesa' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'mpesa' }))}
                    className="flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    M-Pesa
                  </Button>
                  <Button
                    type="button"
                    variant={formData.paymentMethod === 'bank' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank' }))}
                    className="flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Bank Transfer
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Complete Payment'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 