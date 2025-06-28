import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Shield, Send } from 'lucide-react';

interface TermsAndSubmissionProps {
  data: {
    termsAccepted: boolean;
    consentGiven: boolean;
  };
  updateData: (data: Partial<TermsAndSubmissionProps['data']>) => void;
}

export default function TermsAndSubmission({ data, updateData }: TermsAndSubmissionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Terms & Submission</h2>
        <p className="text-gray-600 mt-2">
          Review and accept the terms to complete your registration
        </p>
      </div>

      <Card className="p-6 bg-gray-50">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <FileText className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Terms & Conditions</h3>
              <p className="text-sm text-gray-600 mt-1">
                By participating in the Regional Climate Change & AgriExpo, you agree to:
              </p>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li>• Comply with all event rules and regulations</li>
                <li>• Maintain professional conduct throughout the event</li>
                <li>• Respect intellectual property rights</li>
                <li>• Follow safety and security protocols</li>
                <li>• Accept photography and video recording during the event</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900">Data Privacy</h3>
              <p className="text-sm text-gray-600 mt-1">
                We are committed to protecting your personal information:
              </p>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li>• Data is collected for event management purposes</li>
                <li>• Information may be shared with event partners</li>
                <li>• You can request data access or deletion</li>
                <li>• We use industry-standard security measures</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4 mt-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={data.termsAccepted}
            onCheckedChange={(checked) => 
              updateData({ termsAccepted: checked as boolean })
            }
          />
          <div className="space-y-1 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept Terms & Conditions
            </Label>
            <p className="text-sm text-gray-500">
              I agree to the terms & conditions and confirm my sponsorship selection
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="consent"
            checked={data.consentGiven}
            onCheckedChange={(checked) => 
              updateData({ consentGiven: checked as boolean })
            }
          />
          <div className="space-y-1 leading-none">
            <Label
              htmlFor="consent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Communication Consent
            </Label>
            <p className="text-sm text-gray-500">
              I consent to being contacted about this event and related updates
            </p>
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-8 bg-green-600 hover:bg-green-700"
        disabled={!data.termsAccepted || !data.consentGiven}
      >
        <Send className="w-4 h-4 mr-2" />
        Submit Registration
      </Button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Need help? Contact our support team at support@regionalexpo.com
      </p>
    </div>
  );
} 