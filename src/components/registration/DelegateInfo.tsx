import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface DelegateInfoProps {
  data: {
    delegateCount: number;
    delegateNames: string[];
  };
  updateData: (data: Partial<DelegateInfoProps['data']>) => void;
}

export default function DelegateInfo({ data, updateData }: DelegateInfoProps) {
  const handleAddDelegate = () => {
    updateData({
      delegateCount: data.delegateCount + 1,
      delegateNames: [...data.delegateNames, '']
    });
  };

  const handleRemoveDelegate = (index: number) => {
    const newNames = data.delegateNames.filter((_, i) => i !== index);
    updateData({
      delegateCount: data.delegateCount - 1,
      delegateNames: newNames
    });
  };

  const handleDelegateNameChange = (index: number, value: string) => {
    const newNames = [...data.delegateNames];
    newNames[index] = value;
    updateData({ delegateNames: newNames });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Delegate Information</h2>
        <p className="text-gray-600 mt-2">
          Add the details of all delegates attending the expo
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label>Number of Delegates</Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                if (data.delegateCount > 1) {
                  updateData({
                    delegateCount: data.delegateCount - 1,
                    delegateNames: data.delegateNames.slice(0, -1)
                  });
                }
              }}
              disabled={data.delegateCount <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-medium text-lg w-8 text-center">
              {data.delegateCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddDelegate}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {data.delegateNames.map((name, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor={`delegate-${index}`}>
                  Delegate {index + 1} Full Name
                </Label>
                <Input
                  id={`delegate-${index}`}
                  value={name}
                  onChange={(e) => handleDelegateNameChange(index, e.target.value)}
                  placeholder="Enter delegate's full name"
                  className="mt-1"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() => handleRemoveDelegate(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddDelegate}
          className="w-full mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Delegate
        </Button>
      </div>
    </div>
  );
} 