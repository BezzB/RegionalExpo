import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BrandingInfoProps {
  data: {
    fasciaName: string;
    socialMedia: {
      twitter: string;
      facebook: string;
      linkedin: string;
      instagram: string;
    };
  };
  updateData: (data: Partial<BrandingInfoProps['data']>) => void;
}

export default function BrandingInfo({ data, updateData }: BrandingInfoProps) {
  const handleSocialMediaChange = (platform: keyof typeof data.socialMedia, value: string) => {
    updateData({
      socialMedia: {
        ...data.socialMedia,
        [platform]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Branding & Booth Info</h2>
        <p className="text-gray-600 mt-2">
          Customize how your brand will be displayed at the expo
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fasciaName">
            Fascia Name (max 25 characters)
          </Label>
          <Input
            id="fasciaName"
            value={data.fasciaName}
            onChange={(e) => {
              const value = e.target.value.slice(0, 25);
              updateData({ fasciaName: value });
            }}
            placeholder="Enter your fascia name"
            maxLength={25}
          />
          <p className="text-sm text-gray-500">
            This is the name that will appear on your booth header
          </p>
        </div>

        <div className="space-y-4">
          <Label>Social Media Handles</Label>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-sm text-gray-600">
                Twitter/X Handle
              </Label>
              <Input
                id="twitter"
                value={data.socialMedia.twitter}
                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                placeholder="@username"
                className="bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-sm text-gray-600">
                Facebook Page
              </Label>
              <Input
                id="facebook"
                value={data.socialMedia.facebook}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                placeholder="facebook.com/page"
                className="bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm text-gray-600">
                LinkedIn Page
              </Label>
              <Input
                id="linkedin"
                value={data.socialMedia.linkedin}
                onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                placeholder="linkedin.com/company/name"
                className="bg-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm text-gray-600">
                Instagram Handle
              </Label>
              <Input
                id="instagram"
                value={data.socialMedia.instagram}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                placeholder="@username"
                className="bg-white/50"
              />
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Your social media handles will be included in our digital directory
          </p>
        </div>
      </div>
    </div>
  );
} 