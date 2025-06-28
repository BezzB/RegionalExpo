import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Globe, 
  User, 
  Users, 
  Package, 
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';

// Form sections
import CompanyDetails from '@/components/registration/CompanyDetails';
import ContactPerson from '@/components/registration/ContactPerson';
import SponsorshipPackage from '@/components/registration/SponsorshipPackage';
import BrandingInfo from '@/components/registration/BrandingInfo';
import PaymentInfo from '@/components/registration/PaymentInfo';
import TermsAndSubmission from '@/components/registration/TermsAndSubmission';

// Hooks
import { useRegistration } from '@/hooks/useRegistration';

const steps = [
  { id: 'company', title: 'Company Details', icon: Building2 },
  { id: 'contact', title: 'Contact Person', icon: User },
  { id: 'package', title: 'Sponsorship Package', icon: Package },
  { id: 'branding', title: 'Branding & Booth', icon: Globe },
  { id: 'payment', title: 'Payment Info', icon: FileCheck },
  { id: 'terms', title: 'Terms & Submit', icon: FileCheck }
];

export default function SponsorRegistration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    companyWebsite: '',
    country: '',
    organizationType: '',
    companyLogo: null as File | null,
    
    // Contact Person
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    
    // Sponsorship Package
    package: '',
    
    // Branding Info
    fasciaName: '',
    socialMedia: {
      twitter: '',
      facebook: '',
      linkedin: '',
      instagram: ''
    },
    
    // Payment Info
    paymentMethod: '',
    
    // Terms
    termsAccepted: false,
    consentGiven: false
  });

  const { submitRegistration, isLoading, error } = useRegistration();
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Company Details
        return !!(formData.companyName && formData.country && formData.organizationType);
      case 1: // Contact Person
        return !!(formData.fullName && formData.jobTitle && formData.email && formData.phone);
      case 2: // Sponsorship Package
        return !!formData.package;
      case 3: // Branding Info
        return !!formData.fasciaName;
      case 4: // Payment Info
        return !!formData.paymentMethod;
      case 5: // Terms
        return formData.termsAccepted && formData.consentGiven;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const result = await submitRegistration(formData);

    if (result.success) {
      toast({
        title: 'Registration Successful',
        description: 'Your sponsorship registration has been submitted successfully.',
      });
      navigate('/registration-success', { 
        state: { 
          type: 'sponsor',
          data: formData 
        }
      });
    } else {
      toast({
        title: 'Registration Failed',
        description: result.error || 'An error occurred during registration.',
        variant: 'destructive'
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CompanyDetails data={formData} updateData={updateFormData} />;
      case 1:
        return <ContactPerson data={formData} updateData={updateFormData} />;
      case 2:
        return <SponsorshipPackage data={formData} updateData={updateFormData} />;
      case 3:
        return <BrandingInfo data={formData} updateData={updateFormData} />;
      case 4:
        return <PaymentInfo data={formData} updateData={updateFormData} />;
      case 5:
        return <TermsAndSubmission data={formData} updateData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sponsorship Registration
        </h1>
        <p className="text-gray-600">
          Showcase your brand at the Regional Climate Change & AgriExpo
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-6 text-xs font-medium text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-full top-1/2 w-full h-0.5 -translate-y-1/2 ${
                      index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <Card className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button
            onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={!validateStep() || isLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
} 