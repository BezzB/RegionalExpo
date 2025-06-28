import { useState } from 'react';
import supabase from '@/lib/supabase';

interface RegistrationData {
  // Company Details
  companyName: string;
  companyWebsite: string;
  country: string;
  organizationType: string;
  companyLogo: File | null;
  
  // Contact Person
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  
  // Sponsorship Package
  package: string;
  
  // Delegate Info
  delegateCount: number;
  delegateNames: string[];
  
  // Branding Info
  fasciaName: string;
  socialMedia: {
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
  };
  
  // Payment Info
  paymentMethod: string;
  
  // Terms
  termsAccepted: boolean;
  consentGiven: boolean;
}

interface RegistrationResponse {
  success: boolean;
  error: string | null;
  data: any | null;
}

export function useRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRegistration = async (data: RegistrationData): Promise<RegistrationResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Upload logo if provided
      let companyLogoUrl = null;
      if (data.companyLogo) {
        const fileExt = data.companyLogo.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(fileName, data.companyLogo);

        if (uploadError) {
          throw new Error(`Error uploading logo: ${uploadError.message}`);
        }

        companyLogoUrl = uploadData.path;
      }

      // Prepare registration data
      const registrationData = {
        company_name: data.companyName,
        company_website: data.companyWebsite,
        country: data.country,
        organization_type: data.organizationType,
        company_logo_url: companyLogoUrl,
        
        contact_name: data.fullName,
        contact_job_title: data.jobTitle,
        contact_email: data.email,
        contact_phone: data.phone,
        
        package_id: data.package,
        
        delegate_count: data.delegateCount,
        delegate_names: data.delegateNames,
        
        fascia_name: data.fasciaName,
        social_media: data.socialMedia,
        
        payment_method: data.paymentMethod,
        
        terms_accepted: data.termsAccepted,
        consent_given: data.consentGiven
      };

      // Insert registration
      const { data: registrationResult, error: registrationError } = await supabase
        .from('registrations')
        .insert([registrationData])
        .select()
        .single();

      if (registrationError) {
        throw new Error(`Error submitting registration: ${registrationError.message}`);
      }

      return {
        success: true,
        error: null,
        data: registrationResult
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitRegistration,
    isLoading,
    error
  };
} 