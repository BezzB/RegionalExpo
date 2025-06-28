import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Award, 
  Medal, 
  Trophy,
  Star,
  Tent,
  Sprout
} from 'lucide-react';

interface SponsorshipPackageProps {
  data: {
    package: string;
    delegateCount: number;
  };
  updateData: (data: Partial<SponsorshipPackageProps['data']>) => void;
}

const packages = [
  {
    id: 'platinum',
    name: 'Platinum Package',
    price: 'KES 10,000,000',
    icon: Crown,
    slots: 3,
    delegateCount: 10,
    color: 'bg-gradient-to-r from-gray-100 to-gray-300',
    benefits: [
      'Premium exhibition space (6x6m)',
      'VIP access for 10 delegates',
      'Keynote speaking opportunity',
      'Premium branding across all venues',
      'Full-page ad in event program'
    ]
  },
  {
    id: 'gold',
    name: 'Gold Package',
    price: 'KES 5,000,000',
    icon: Trophy,
    slots: 5,
    delegateCount: 6,
    color: 'bg-gradient-to-r from-yellow-100 to-yellow-300',
    benefits: [
      'Large exhibition space (4x4m)',
      'VIP access for 6 delegates',
      'Panel speaking opportunity',
      'Premium branding at main venue',
      'Half-page ad in event program'
    ]
  },
  {
    id: 'silver',
    name: 'Silver Package',
    price: 'KES 2,500,000',
    icon: Medal,
    slots: 10,
    delegateCount: 4,
    color: 'bg-gradient-to-r from-gray-100 to-gray-200',
    benefits: [
      'Standard exhibition space (3x3m)',
      'Access for 4 delegates',
      'Branding at selected areas',
      'Quarter-page ad in event program'
    ]
  },
  {
    id: 'bronze',
    name: 'Bronze Package',
    price: 'KES 500,000',
    icon: Award,
    slots: 15,
    delegateCount: 2,
    color: 'bg-gradient-to-r from-orange-100 to-orange-200',
    benefits: [
      'Small exhibition space (2x2m)',
      'Access for 2 delegates',
      'Basic branding package',
      'Logo in event program'
    ]
  },
  {
    id: 'gala',
    name: 'Special Gala Dinner Sponsor',
    price: 'KES 1,000,000 + 30,000',
    icon: Star,
    slots: 2,
    delegateCount: 8,
    color: 'bg-gradient-to-r from-purple-100 to-purple-200',
    benefits: [
      'Exclusive gala dinner branding',
      'VIP table for 8 guests',
      'Speaking opportunity at dinner',
      'Special mention in program'
    ]
  },
  {
    id: 'exhibition',
    name: 'Exhibition Package',
    price: 'KES 100,000',
    icon: Tent,
    slots: null,
    delegateCount: 1,
    color: 'bg-gradient-to-r from-blue-100 to-blue-200',
    benefits: [
      'Exhibition space (2x2m)',
      'Access for 1 delegate',
      'Basic listing in program'
    ]
  },
  {
    id: 'cbo',
    name: 'CBO Exhibition',
    price: 'KES 30,000',
    icon: Sprout,
    slots: null,
    delegateCount: 1,
    color: 'bg-gradient-to-r from-green-100 to-green-200',
    benefits: [
      'Small booth space',
      'Access for 1 delegate',
      'Listing in program'
    ]
  }
];

export default function SponsorshipPackage({ data, updateData }: SponsorshipPackageProps) {
  const [selectedPackage, setSelectedPackage] = useState(data.package);

  const handlePackageSelect = (packageId: string) => {
    const selectedPkg = packages.find(pkg => pkg.id === packageId);
    setSelectedPackage(packageId);
    updateData({ 
      package: packageId,
      delegateCount: selectedPkg?.delegateCount || 1 // Default to 1 if not found
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Select Your Package</h2>
        <p className="text-gray-600 mt-2">
          Choose the sponsorship package that best suits your organization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          const isSelected = selectedPackage === pkg.id;

          return (
            <Card
              key={pkg.id}
              className={`relative p-6 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'ring-2 ring-green-600 shadow-lg'
                  : 'hover:shadow-md'
              } ${pkg.color}`}
              onClick={() => handlePackageSelect(pkg.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-green-600' : 'text-gray-600'}`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                    <p className="text-sm font-medium text-gray-600">{pkg.price}</p>
                  </div>
                </div>
                {pkg.slots && (
                  <Badge variant="outline" className="bg-white/50">
                    {pkg.slots} Slots Left
                  </Badge>
                )}
              </div>

              <ul className="space-y-2 mt-4">
                {pkg.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {isSelected && (
                <div className="absolute inset-0 border-2 border-green-600 rounded-lg pointer-events-none" />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
} 