import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import supabase from '@/lib/supabase';

interface DelegateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  address: string;
  attendanceType: 'physical' | 'virtual';
  dietaryRequirements: string;
  specialNeeds: string;
  termsAccepted: boolean;
}

export default function DelegateRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<DelegateFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    address: '',
    attendanceType: 'physical',
    dietaryRequirements: '',
    specialNeeds: '',
    termsAccepted: false,
  });

  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: 'Missing Name',
        description: 'Please enter your full name.',
        variant: 'destructive',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return false;
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.termsAccepted) {
      toast({
        title: 'Terms Not Accepted',
        description: 'Please accept the terms and conditions to proceed.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('Attempting to connect to Supabase...');
      
      // Test connection first
      const { data: testData, error: testError } = await supabase
        .from('attendees')
        .select('count')
        .limit(1);
        
      if (testError) {
        console.error('Connection test failed:', testError);
        throw new Error(`Connection test failed: ${testError.message}`);
      }
      
      console.log('Connection successful, attempting registration...');

      const { data, error } = await supabase
        .from('attendees')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            job_title: formData.jobTitle,
            address: formData.address,
            ticket_type: 'general',
            attendance_type: formData.attendanceType,
            dietary_requirements: formData.dietaryRequirements,
            special_needs: formData.specialNeeds,
            terms_accepted: formData.termsAccepted,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }
      
      console.log('Registration successful:', data);
      
      navigate('/registration-success', { 
        state: { 
          type: 'delegate',
          data: data 
        }
      });
    } catch (error: any) {
      console.error('Full error details:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred while submitting your registration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Delegate Registration
          </h1>
          <p className="text-gray-600">
            Join us at the Regional Climate Change & AgriExpo
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company">Company/Organization *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Enter your company name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="Enter your job title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="attendanceType">Attendance Type *</Label>
                <Select
                  value={formData.attendanceType}
                  onValueChange={(value: 'physical' | 'virtual') => 
                    setFormData(prev => ({ ...prev, attendanceType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select attendance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical Attendance</SelectItem>
                    <SelectItem value="virtual">Virtual Attendance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
                <Input
                  id="dietaryRequirements"
                  value={formData.dietaryRequirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, dietaryRequirements: e.target.value }))}
                  placeholder="Any dietary requirements?"
                />
              </div>

              <div>
                <Label htmlFor="specialNeeds">Special Needs/Accessibility Requirements</Label>
                <Input
                  id="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialNeeds: e.target.value }))}
                  placeholder="Any special needs or accessibility requirements?"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked: boolean) => 
                    setFormData(prev => ({ ...prev, termsAccepted: checked }))
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions of the event *
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
} 