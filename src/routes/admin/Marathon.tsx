import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase from '@/lib/supabase';
import { 
  Plus, Trash2, Edit2, Loader2, Search, Filter, Download,
  Timer, User, Mail, Phone, Calendar, Heart, Medal, AlertCircle
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface MarathonRegistration {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  race_category: '5K' | '10K' | '21K';
  t_shirt_size: string;
  previous_experience: string | null;
  medical_conditions: string | null;
  payment_status: string;
  bib_number: string | null;
  finish_time: string | null;
  completion_status: 'registered' | 'completed' | 'dnf' | 'dns';
}

export default function AdminMarathon() {
  const [registrations, setRegistrations] = useState<MarathonRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchRegistrations();
  }, [debouncedSearch, selectedCategory, selectedStatus]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('marathon_registrations')
        .select('*');

      if (debouncedSearch) {
        query = query.or(`full_name.ilike.%${debouncedSearch}%,email.ilike.%${debouncedSearch}%`);
      }

      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('race_category', selectedCategory);
      }

      if (selectedStatus && selectedStatus !== 'all') {
        query = query.eq('completion_status', selectedStatus);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setRegistrations(data || []);
    } catch (err) {
      console.error('Error fetching marathon registrations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error: updateError } = await supabase
        .from('marathon_registrations')
        .update({ completion_status: status })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchRegistrations();
      toast({
        title: 'Status Updated',
        description: 'Registration status has been updated successfully.',
      });
    } catch (err) {
      console.error('Error updating status:', err);
      toast({
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateBibNumber = async (id: string, bibNumber: string) => {
    try {
      const { error: updateError } = await supabase
        .from('marathon_registrations')
        .update({ bib_number: bibNumber })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchRegistrations();
      toast({
        title: 'Bib Number Updated',
        description: 'Bib number has been updated successfully.',
      });
    } catch (err) {
      console.error('Error updating bib number:', err);
      toast({
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'Failed to update bib number',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateFinishTime = async (id: string, finishTime: string) => {
    try {
      const { error: updateError } = await supabase
        .from('marathon_registrations')
        .update({ 
          finish_time: finishTime,
          completion_status: 'completed'
        })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchRegistrations();
      toast({
        title: 'Finish Time Updated',
        description: 'Finish time has been updated successfully.',
      });
    } catch (err) {
      console.error('Error updating finish time:', err);
      toast({
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'Failed to update finish time',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    const csv = [
      ['Full Name', 'Email', 'Phone', 'Category', 'Bib Number', 'Status', 'Finish Time'],
      ...registrations.map(reg => [
        reg.full_name,
        reg.email,
        reg.phone,
        reg.race_category,
        reg.bib_number || '',
        reg.completion_status,
        reg.finish_time || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'marathon-registrations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold">Error Loading Registrations</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marathon Registrations</h1>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="5K">5K</SelectItem>
            <SelectItem value="10K">10K</SelectItem>
            <SelectItem value="21K">Half Marathon (21K)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="registered">Registered</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="dnf">Did Not Finish</SelectItem>
            <SelectItem value="dns">Did Not Start</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {registrations.map((registration) => (
          <Card key={registration.id} className="p-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold">{registration.full_name}</h3>
                  <Badge>{registration.race_category}</Badge>
                  <Badge variant={registration.completion_status === 'completed' ? 'default' : 'secondary'}>
                    {registration.completion_status}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {registration.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {registration.phone}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Age: {new Date().getFullYear() - new Date(registration.date_of_birth).getFullYear()}
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {registration.medical_conditions ? 'Has medical conditions' : 'No medical conditions'}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Bib Number"
                    value={registration.bib_number || ''}
                    onChange={(e) => handleUpdateBibNumber(registration.id, e.target.value)}
                    className="w-32"
                  />
                  <Input
                    type="time"
                    step="1"
                    placeholder="Finish Time"
                    value={registration.finish_time || ''}
                    onChange={(e) => handleUpdateFinishTime(registration.id, e.target.value)}
                    className="w-32"
                  />
                </div>

                <Select
                  value={registration.completion_status}
                  onValueChange={(value) => handleUpdateStatus(registration.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="dnf">Did Not Finish</SelectItem>
                    <SelectItem value="dns">Did Not Start</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 