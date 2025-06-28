import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react';

interface CompanyDetailsProps {
  data: {
    companyName: string;
    companyWebsite: string;
    country: string;
    organizationType: string;
    companyLogo: File | null;
  };
  updateData: (data: Partial<CompanyDetailsProps['data']>) => void;
}

const organizationTypes = [
  { value: 'corporation', label: 'Corporation' },
  { value: 'sme', label: 'Small/Medium Enterprise (SME)' },
  { value: 'ngo', label: 'Non-Governmental Organization (NGO)' },
  { value: 'government', label: 'Government Agency' },
  { value: 'cbo', label: 'Community-Based Organization (CBO)' },
  { value: 'startup', label: 'Startup' },
  { value: 'academic', label: 'Academic/Research Institution' },
  { value: 'other', label: 'Other' }
];

export default function CompanyDetails({ data, updateData }: CompanyDetailsProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateData({ companyLogo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
        <p className="text-gray-600 mt-2">Tell us about your organization</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={data.companyName}
            onChange={(e) => updateData({ companyName: e.target.value })}
            placeholder="Enter your company name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyWebsite">Company Website</Label>
          <Input
            id="companyWebsite"
            type="url"
            value={data.companyWebsite}
            onChange={(e) => updateData({ companyWebsite: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={data.country}
            onChange={(e) => updateData({ country: e.target.value })}
            placeholder="Enter your country"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizationType">Organization Type</Label>
          <Select
            value={data.organizationType}
            onValueChange={(value) => updateData({ organizationType: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              {organizationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            Choose the type that best describes your organization
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyLogo">Company Logo</Label>
          <div className="flex items-center gap-4">
            <Input
              id="companyLogo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="flex-1"
            />
            {logoPreview && (
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={logoPreview}
                  alt="Company logo preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Upload your company logo (PNG, JPG, SVG)
          </p>
        </div>
      </div>
    </div>
  );
} 