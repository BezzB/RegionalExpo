import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactPersonProps {
  data: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
  };
  updateData: (data: Partial<ContactPersonProps['data']>) => void;
}

export default function ContactPerson({ data, updateData }: ContactPersonProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Contact Person</h2>
        <p className="text-gray-600 mt-2">
          Who should we contact regarding your registration?
        </p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title/Designation</Label>
          <Input
            id="jobTitle"
            value={data.jobTitle}
            onChange={(e) => updateData({ jobTitle: e.target.value })}
            placeholder="Enter your job title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="you@example.com"
            required
          />
          <p className="text-sm text-gray-500">
            We'll send important updates to this email
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (with WhatsApp if available)</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="+254 XXX XXX XXX"
            required
          />
          <p className="text-sm text-gray-500">
            Include country code and WhatsApp number if available
          </p>
        </div>
      </div>
    </div>
  );
} 