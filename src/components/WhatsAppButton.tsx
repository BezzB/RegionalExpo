import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WhatsAppButtonProps {
  packageName: string
  price: string
}

const getPackageColors = (packageName: string) => {
  switch (packageName) {
    case "Platinum Package":
      return {
        border: '[#C0A960]',
        text: '[#8B7B3B]',
        hover: '[#8B7B3B]'
      };
    case "Gold Package":
      return {
        border: 'amber-400',
        text: 'amber-600',
        hover: 'amber-700'
      };
    case "Silver Package":
      return {
        border: 'slate-400',
        text: 'slate-600',
        hover: 'slate-700'
      };
    case "Bronze Package":
      return {
        border: 'orange-400',
        text: 'orange-600',
        hover: 'orange-700'
      };
    default:
      return {
        border: '[#25D366]',
        text: '[#25D366]',
        hover: '[#128C7E]'
      };
  }
};

export function WhatsAppButton({ packageName, price }: WhatsAppButtonProps) {
  const colors = getPackageColors(packageName);
  const WHATSAPP_NUMBER = "254724556401" // Remove any spaces or special characters
  
  const message = encodeURIComponent(
    `Hello, I'm interested in the ${packageName} package (KES ${price}). Please provide more information about sponsorship.`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

  const handleClick = () => {
    // Track the click event
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'whatsapp_sponsor_click', {
          event_category: 'Sponsorship',
          event_label: packageName,
          value: parseFloat(price.replace(/[^0-9.]/g, '')),
        })
      }
    } catch (error) {
      console.error('Error tracking WhatsApp click:', error)
    }

    // Open WhatsApp
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="space-y-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`w-full group relative overflow-hidden border-${colors.border}/30 text-${colors.text} hover:text-${colors.hover} transition-colors duration-300`}
          >
            <span className="relative z-10">How it works</span>
            <span className={`absolute inset-0 bg-${colors.border}/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sponsorship via WhatsApp</DialogTitle>
            <DialogDescription>
              Follow these simple steps to become a sponsor:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Initial Contact</h4>
              <p className="text-sm text-muted-foreground">
                Click the WhatsApp button to start a conversation with our sponsorship team.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Package Discussion</h4>
              <p className="text-sm text-muted-foreground">
                Our team will provide detailed information about the package and answer any questions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Reservation</h4>
              <p className="text-sm text-muted-foreground">
                Secure your spot with a KES 30,000 reservation fee.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">4. Confirmation</h4>
              <p className="text-sm text-muted-foreground">
                Receive official confirmation and sponsorship details via email.
              </p>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Contact hours: Monday-Friday, 9:00 AM - 5:00 PM EAT</p>
              <p>Average response time: 1-2 business hours</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              onClick={handleClick}
            >
              <div className="relative">
                <MessageCircle className="h-5 w-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-white rounded-full"></span>
              </div>
              Sponsor via WhatsApp 
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] p-4">
            <p>Click to start a WhatsApp conversation with our sponsorship team.</p>
            <p className="mt-2 text-sm text-muted-foreground">We typically respond within 1-2 business hours.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
} 