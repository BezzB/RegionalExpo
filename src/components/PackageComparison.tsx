import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'

interface Package {
  name: string
  price: string
  currency: string
  description: string
  slots?: number | null
  benefits: string[]
  featured: boolean
  reservationFee?: number
}

interface PackageComparisonProps {
  packages: Package[]
}

export function PackageComparison({ packages }: PackageComparisonProps) {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])

  const togglePackage = (packageName: string) => {
    setSelectedPackages(prev => {
      if (prev.includes(packageName)) {
        return prev.filter(p => p !== packageName)
      }
      if (prev.length < 3) {
        return [...prev, packageName]
      }
      return prev
    })
  }

  // Get all unique benefits across all packages
  const allBenefits = Array.from(
    new Set(packages.flatMap(pkg => pkg.benefits))
  )

  const isPackageSelected = (packageName: string) => selectedPackages.includes(packageName)

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap gap-2">
        {packages.map((pkg) => (
          <Button
            key={pkg.name}
            variant={isPackageSelected(pkg.name) ? "default" : "outline"}
            onClick={() => togglePackage(pkg.name)}
            className={`flex items-center gap-2 transition-all duration-300 ${
              isPackageSelected(pkg.name) 
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg' 
                : 'hover:border-primary/50'
            }`}
          >
            {pkg.name}
            {pkg.featured && (
              <Badge variant="secondary" className={`ml-2 ${
                isPackageSelected(pkg.name) 
                  ? 'bg-white/20 text-white' 
                  : 'bg-primary/10 text-primary'
              }`}>
                Featured
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {selectedPackages.length > 0 && (
        <div className="rounded-lg border overflow-x-auto bg-white/50 backdrop-blur-sm shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px] font-semibold">Feature</TableHead>
                {packages
                  .filter(pkg => selectedPackages.includes(pkg.name))
                  .map(pkg => (
                    <TableHead key={pkg.name} className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                          {pkg.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {pkg.currency} {pkg.price}
                        </span>
                        {pkg.featured && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allBenefits.map((benefit, idx) => (
                <TableRow key={benefit + '-' + idx} className="group hover:bg-muted/30 transition-colors duration-200">
                  <TableCell className="font-medium">{benefit}</TableCell>
                  {packages
                    .filter(pkg => selectedPackages.includes(pkg.name))
                    .map(pkg => (
                      <TableCell key={pkg.name} className="text-center">
                        {pkg.benefits.includes(benefit) ? (
                          <div className="flex items-center justify-center">
                            <div className="rounded-full p-1 bg-primary/10 text-primary transform transition-transform duration-300 group-hover:scale-110">
                              <Check className="h-4 w-4" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <div className="rounded-full p-1 bg-muted-foreground/10 text-muted-foreground">
                              <X className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 