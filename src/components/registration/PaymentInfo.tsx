import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, Building2, CircleDollarSign } from 'lucide-react';

interface PaymentInfoProps {
  data: {
    paymentMethod: string;
  };
  updateData: (data: Partial<PaymentInfoProps['data']>) => void;
}

const paymentMethods = [
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: Building2,
    description: 'Pay via bank transfer to our account',
    instructions: 'Bank details will be sent to your email'
  },
  {
    id: 'mpesa',
    name: 'M-Pesa',
    icon: Smartphone,
    description: 'Pay using M-Pesa mobile money',
    instructions: 'M-Pesa Paybill details will be provided'
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Pay securely with your card',
    instructions: 'You will be redirected to our secure payment gateway'
  },
  {
    id: 'other',
    name: 'Other Payment Methods',
    icon: CircleDollarSign,
    description: 'Contact us for alternative payment options',
    instructions: 'Our team will reach out to discuss options'
  }
];

export default function PaymentInfo({ data, updateData }: PaymentInfoProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
        <p className="text-gray-600 mt-2">
          Choose your preferred payment method
        </p>
      </div>

      <RadioGroup
        value={data.paymentMethod}
        onValueChange={(value) => updateData({ paymentMethod: value })}
        className="grid gap-4"
      >
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Label
              key={method.id}
              className="cursor-pointer"
              htmlFor={method.id}
            >
              <Card className={`p-4 ${
                data.paymentMethod === method.id
                  ? 'ring-2 ring-green-600'
                  : 'hover:border-green-200'
              }`}>
                <div className="flex gap-4">
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {method.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                    {data.paymentMethod === method.id && (
                      <p className="text-sm text-green-600 mt-2">
                        {method.instructions}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Label>
          );
        })}
      </RadioGroup>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Important Notes:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• A non-refundable reservation fee of KES 30,000 is required to secure your spot</li>
          <li>• Full payment must be completed 30 days before the event</li>
          <li>• Payment confirmation and receipt will be sent to your email</li>
          <li>• For any payment queries, contact our finance team</li>
        </ul>
      </div>
    </div>
  );
} 