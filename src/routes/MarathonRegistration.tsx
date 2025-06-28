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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import supabase from '@/lib/supabase';

interface MarathonFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  tShirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  raceCategory: '5K' | '10K' | '21K';
  previousExperience: string;
  medicalConditions: string;
  termsAccepted: boolean;
  liabilityAccepted: boolean;
}

export default function MarathonRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<MarathonFormData>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    tShirtSize: 'M',
    raceCategory: '5K',
    previousExperience: '',
    medicalConditions: '',
    termsAccepted: false,
    liabilityAccepted: false,
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.emergencyContact.name ||
      !formData.emergencyContact.phone ||
      !formData.emergencyContact.relationship
    ) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.termsAccepted || !formData.liabilityAccepted) {
      toast({
        title: 'Terms & Conditions',
        description: 'Please accept both the terms and conditions and the liability waiver.',
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

    // Validate age (must be at least 18)
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      toast({
        title: 'Age Restriction',
        description: 'Participants must be at least 18 years old.',
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
      console.log('Attempting to submit marathon registration...');
      
      const { data, error } = await supabase
        .from('marathon_registrations')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
            emergency_contact_name: formData.emergencyContact.name,
            emergency_contact_phone: formData.emergencyContact.phone,
            emergency_contact_relationship: formData.emergencyContact.relationship,
            race_category: formData.raceCategory,
            t_shirt_size: formData.tShirtSize,
            previous_experience: formData.previousExperience || null,
            medical_conditions: formData.medicalConditions || null,
            terms_accepted: formData.termsAccepted,
            liability_accepted: formData.liabilityAccepted,
            status: 'pending',
            completion_status: 'registered'
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
          type: 'marathon',
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
            First Lady Marathon Registration
          </h1>
          <p className="text-gray-600">
            Join us for this prestigious event supporting climate change awareness
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
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
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label>Gender *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value: 'male' | 'female' | 'other') => 
                    setFormData(prev => ({ ...prev, gender: value }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Emergency Contact *</h3>
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                    }))}
                    placeholder="Emergency contact name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                    }))}
                    placeholder="Emergency contact phone"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                    }))}
                    placeholder="Relationship to emergency contact"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tShirtSize">T-Shirt Size *</Label>
                <Select
                  value={formData.tShirtSize}
                  onValueChange={(value: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => 
                    setFormData(prev => ({ ...prev, tShirtSize: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your t-shirt size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XS">XS</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                    <SelectItem value="XXL">XXL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="raceCategory">Race Category *</Label>
                <Select
                  value={formData.raceCategory}
                  onValueChange={(value: '5K' | '10K' | '21K') => 
                    setFormData(prev => ({ ...prev, raceCategory: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your race category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5K">5K</SelectItem>
                    <SelectItem value="10K">10K</SelectItem>
                    <SelectItem value="21K">Half Marathon (21K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="previousExperience">Previous Running Experience</Label>
                <Input
                  id="previousExperience"
                  value={formData.previousExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, previousExperience: e.target.value }))}
                  placeholder="Tell us about your running experience"
                />
              </div>

              <div>
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Input
                  id="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                  placeholder="Any medical conditions we should be aware of?"
                />
              </div>

              <div className="space-y-2">
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="liability"
                    checked={formData.liabilityAccepted}
                    onCheckedChange={(checked: boolean) => 
                      setFormData(prev => ({ ...prev, liabilityAccepted: checked }))
                    }
                  />
                  <Label htmlFor="liability" className="text-sm">
                    I accept the liability waiver and understand the risks involved *
                  </Label>
                </div>
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