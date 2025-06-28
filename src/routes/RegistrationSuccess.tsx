import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, Download, Share2 } from 'lucide-react';

interface LocationState {
  type: 'delegate' | 'marathon' | 'sponsor';
  data: any;
}

export default function RegistrationSuccess() {
  const location = useLocation();
  const state = location.state as LocationState;

  const getSuccessContent = () => {
    switch (state?.type) {
      case 'delegate':
        return {
          title: 'Delegate Registration Successful!',
          message: 'Thank you for registering as a delegate for the Regional Climate Change & AgriExpo.',
          details: [
            'You will receive a confirmation email shortly with your registration details.',
            'Your delegate pass will be available for collection at the registration desk.',
            'Please arrive 30 minutes before the event for check-in.'
          ],
          nextSteps: [
            {
              icon: Calendar,
              text: 'Add to Calendar',
              action: '#'
            },
            {
              icon: Download,
              text: 'Download Registration Details',
              action: '#'
            }
          ]
        };
      
      case 'marathon':
        return {
          title: 'Marathon Registration Successful!',
          message: 'Thank you for registering for the First Lady Marathon event.',
          details: [
            `You're registered for the ${state.data.raceCategory} category.`,
            'Race kit collection details will be sent to your email.',
            'Please arrive 1 hour before the race for warm-up and preparations.'
          ],
          nextSteps: [
            {
              icon: Calendar,
              text: 'Add Race Day to Calendar',
              action: '#'
            },
            {
              icon: Download,
              text: 'Download Race Information',
              action: '#'
            },
            {
              icon: Share2,
              text: 'Share on Social Media',
              action: '#'
            }
          ]
        };
      
      case 'sponsor':
        return {
          title: 'Sponsorship Registration Successful!',
          message: 'Thank you for registering as a sponsor for the Regional Climate Change & AgriExpo.',
          details: [
            `Your selected package: ${state.data.package}`,
            'Our sponsorship team will contact you within 24 hours.',
            'Please check your email for the sponsorship agreement and next steps.'
          ],
          nextSteps: [
            {
              icon: Calendar,
              text: 'Schedule Sponsor Briefing',
              action: '#'
            },
            {
              icon: Download,
              text: 'Download Sponsor Kit',
              action: '#'
            }
          ]
        };
      
      default:
        return {
          title: 'Registration Successful!',
          message: 'Thank you for registering for the Regional Climate Change & AgriExpo.',
          details: [
            'You will receive a confirmation email shortly.',
            'Please check your email for further instructions.'
          ],
          nextSteps: [
            {
              icon: Calendar,
              text: 'Add to Calendar',
              action: '#'
            }
          ]
        };
    }
  };

  const content = getSuccessContent();

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>

          <p className="text-gray-600 mb-6">
            {content.message}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">Important Information:</h2>
            <ul className="space-y-2 text-left">
              {content.details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-2" />
                  <span className="text-gray-600">{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-8">
            {content.nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-12"
                  asChild
                >
                  <Link to={step.action}>
                    <Icon className="w-4 h-4" />
                    {step.text}
                  </Link>
                </Button>
              );
            })}
          </div>

          <div className="border-t pt-6">
            <p className="text-gray-600 mb-4">
              Need assistance? Contact our support team
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
} 