import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Timer, Award } from 'lucide-react';

const registrationTypes = [
  {
    id: 'delegate',
    title: 'Delegate Registration',
    description: 'Join as a delegate to network, learn and participate in the expo',
    icon: Users,
    features: [
      'Access to all expo events',
      'Networking opportunities',
      'Conference materials',
      'Lunch and refreshments'
    ],
    price: 'KES 15,000',
    route: '/register/delegate'
  },
  {
    id: 'marathon',
    title: 'First Lady Marathon',
    description: 'Be part of the prestigious First Lady Marathon event',
    icon: Timer,
    features: [
      'Official race entry',
      'Race kit and T-shirt',
      'Medal upon completion',
      'Refreshments'
    ],
    price: 'KES 2,000',
    route: '/register/marathon'
  },
  {
    id: 'sponsor',
    title: 'Sponsorship Registration',
    description: 'Showcase your brand and support this prestigious event',
    icon: Award,
    features: [
      'Exhibition space',
      'Brand visibility',
      'VIP networking',
      'Marketing opportunities'
    ],
    price: 'Starting from KES 100,000',
    route: '/register/sponsor'
  }
];

export default function RegistrationTypeSelection() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Registration Type
        </h1>
        <p className="text-xl text-gray-600">
          Select the registration option that best suits your participation
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {registrationTypes.map((type) => {
          const Icon = type.icon;
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {type.title}
                  </h2>
                  <p className="text-gray-600">{type.description}</p>
                </div>

                <div className="space-y-4 flex-grow">
                  <div className="space-y-2">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-6">
                    <div className="text-2xl font-bold text-gray-900 mb-6">
                      {type.price}
                    </div>
                    <Button
                      onClick={() => navigate(type.route)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Register Now
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center text-gray-600">
        <p>Need help choosing? Contact our support team for guidance</p>
      </div>
    </div>
  );
} 