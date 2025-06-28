import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  Star, 
  Shield, 
  Trophy, 
  Users,
  Users2, 
  Clock, 
  Crown, 
  Medal, 
  Award,
  Store,
  Sparkles,
  Calendar,
  FileText,
  ChevronDown,
  MessageSquare,
  Globe,
  Phone,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  Building2
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PackageComparison } from '@/components/PackageComparison'
import { ContactForm } from '@/components/ContactForm'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { PaymentForm } from '@/components/payment/PaymentForm'
import { toast } from 'react-hot-toast'

const packages = [
  {
    name: "Platinum Package",
    price: 10000000,
    currency: "KES",
    description: "Premier sponsorship package with maximum visibility and exclusive benefits",
    slots: 3,
    benefits: [
      "Cheque handover ceremony in presence of governor",
      "Head of delegation to address conference with the Governor",
      "Host a panel session as per conference program",
      "Recognition as main sponsors",
      "6 tear drop banners premier exhibition boots with red carpets at preferred locations",
      "2 VVIP delegates, 5 VIP and 10 delegates with entry to all side events galar dinner and cocktail party",
      "5 roll up burners at the main hole",
      "Company logo on all multi media advertisements",
      "2 pages of advertisements in the expo catalog",
      "2 minutes sponsors advertisements to play during break",
      "Logo on all printed materials and all events",
      "Mentions in press releases and all social media",
      "Receive post-registration list (Job title, Company name)",
      "Full-page editorial space in the newspaper supplement following the conference"
    ],
    featured: true
  },
  {
    name: "Gold Package",
    price: 5000000,
    currency: "KES",
    description: "Premium visibility for industry leaders",
    slots: 5,
    benefits: [
      "Host a panel session as per conference program",
      "3 tear drop banners premier exhibition boots with red carpets at preferred locations",
      "3 VIP and 10 delegates with entry to all side events galar dinner and cocktail party",
      "2 roll up burners at the main hole",
      "Company logo on all multi media advertisements",
      "1 page of advertisements in the expo catalog",
      "2 minutes sponsors advertisements to play during break",
      "Logo on all printed materials and all events",
      "Mentions in press releases and all social media",
      "Receive post-registration list (Job title, Company name)",
      "Complimentary exhibition space within a prime area of the event networking area",
      "Acknowledge Sponsor as a sponsor for the event",
      "Sponsor Logo included on the stage sets and all relevant event signage and conference holding slides"
    ],
    featured: false
  },
  {
    name: "Silver Package",
    price: 2500000,
    currency: "KES",
    description: "Enhanced visibility for growing organizations",
    slots: 10,
    benefits: [
      "3 tear drop banners premier exhibition boots at preferred locations",
      "1 VIP and 5 delegates with entry to all side events, galar dinner and cocktail party",
      "1 roll up burners at the main halls",
      "Company logo on all multi media advertisements",
      "1/2 page of advertisements in the expo catalog",
      "1 minute sponsors advertisements to play during break",
      "Logo on all printed materials and all events",
      "Mentions in press releases and all social media",
      "Complimentary exhibition space within a prime area of the event networking area",
      "Acknowledge Sponsor as a sponsor for the event",
      "Sponsor Logo included on the stage sets and all relevant event signage and conference holding slides"
    ],
    featured: false
  },
  {
    name: "Bronze Package",
    price: 500000,
    currency: "KES",
    description: "Perfect entry point for small to medium organizations",
    slots: 15,
    benefits: [
      "5 delegates with entry to all side events and cocktail party",
      "Sponsor Logo added to all event sales collateral and marketing material",
      "Sponsor logo included on any print ads for the event",
      "Sponsor Logo included on the stage sets and all relevant event signage and conference holding slides",
      "Acknowledgment sponsor in the conference report and a quarter page profile",
      "Complimentary exhibition space within event networking area",
      "1 minute sponsors advertisements to play during break"
    ],
    featured: false
  },
  {
    name: "Exhibition Package",
    price: 100000,
    currency: "KES",
    description: "Perfect for showcasing your products and services",
    slots: null,
    benefits: [
      "Booth/Tent (3m by 3m) – includes 1 table, 2chairs and Power Extension (Decor)",
      "Sponsor logo on the Event brochure",
      "2 full conference passes included in the package",
      "Sponsor to be allocated an exhibition space, within event networking area, including: structure, stool, name board, lighting"
    ],
    featured: false
  },
  {
    name: "CBO Exhibition",
    price: 30000,
    currency: "KES",
    description: "Community-Based Organizations Exhibition Package",
    slots: null,
    benefits: [
      "(3m by 3m) Exhibition Space",
      "Sponsor logo on the Event brochure"
    ],
    featured: false
  },
  {
    name: "Special Sponsorship (Gala Dinner)",
    price: 1000000,
    currency: "KES",
    description: "Premium Gala Dinner Sponsorship Package",
    slots: 2,
    benefits: [
      "Sponsor Logo included on the stage sets and all relevant event signage and conference holding slides",
      "2 VVIP delegates, 5 VIP and 10 delegates with entry to all side events gallar dinner and cocktail party",
      "10 Minutes welcome remarks from the head of delegation",
      "5 tear drop banners at Galla Dinner venue",
      "2 Roll up banners at the main stage in the galla dinner",
      "Acknowledge Sponsor as a Sponsor for the Event",
      "Sponsor Logo on all multi media advertisements",
      "Sponsor Logo included on the stage sets and all relevant event signage and conference holding slides",
      "Branding of the Dinner area in the duration of the event",
      "Complimentary exhibition space within event networking area",
      "Head of delegation to lead award giving ceremony"
    ],
    featured: false,
    reservationFee: 30000
  },
  {
    name: "Special Sponsorship (Gala Dinner)",
    price: 300000,
    currency: "KES",
    description: "Standard Gala Dinner Sponsorship Package",
    slots: 5,
    benefits: [
      "Sponsor Logo included on the stage sets and all relevant event signage and conference holding slides",
      "1 VIP and 2 delegates with entry to all side events gallar dinner",
      "1 Roll up banners at the main stage in the galla dinner",
      "Acknowledge Sponsor as a Sponsor for the Event",
      "Sponsor Logo on all multi media advertisements",
      "Sponsor Logo included on the stage sets and all relevant event signage and conference holding slides"
    ],
    featured: false,
    reservationFee: 30000
  }
]

const getPackageStyles = (pkgName: string) => {
  switch (pkgName) {
    case "Platinum Package":
      return {
        border: 'border-[#C0A960]',
        bg: 'bg-gradient-to-br from-[#F5EED6] to-[#E6D5A7]',
        icon: <Crown className="w-8 h-8 text-[#8B7B3B]" />,
        pulse: 'bg-[#C0A960]',
        text: 'text-[#8B7B3B]',
        gradient: 'from-[#C0A960] via-[#F5EED6] to-[#8B7B3B]'
      };
    case "Gold Package":
      return {
        border: 'border-amber-400',
        bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
        icon: <Medal className="w-8 h-8 text-amber-600" />,
        pulse: 'bg-amber-400',
        text: 'text-amber-600',
        gradient: 'from-amber-600 via-amber-400 to-amber-500'
      };
    case "Silver Package":
      return {
        border: 'border-slate-300',
        bg: 'bg-gradient-to-br from-slate-50 to-slate-100',
        icon: <Award className="w-8 h-8 text-slate-600" />,
        pulse: 'bg-slate-400',
        text: 'text-slate-600',
        gradient: 'from-slate-600 via-slate-400 to-slate-500'
      };
    case "Bronze Package":
      return {
        border: 'border-orange-300',
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
        icon: <Medal className="w-8 h-8 text-orange-600" />,
        pulse: 'bg-orange-400',
        text: 'text-orange-600',
        gradient: 'from-orange-600 via-orange-400 to-orange-500'
      };
    case "Exhibition Package":
      return {
        border: 'border-emerald-300',
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
        icon: <Store className="w-8 h-8 text-emerald-600" />,
        pulse: 'bg-emerald-400',
        text: 'text-emerald-600',
        gradient: 'from-emerald-600 via-emerald-400 to-emerald-500'
      };
    case "CBO Exhibition":
      return {
        border: 'border-indigo-300',
        bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
        icon: <Users2 className="w-8 h-8 text-indigo-600" />,
        pulse: 'bg-indigo-400',
        text: 'text-indigo-600',
        gradient: 'from-indigo-600 via-indigo-400 to-indigo-500'
      };
    default:
      if (pkgName.includes("Special Sponsorship")) {
        return {
          border: 'border-purple-300',
          bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
          icon: <Sparkles className="w-8 h-8 text-purple-600" />,
          pulse: 'bg-purple-400',
          text: 'text-purple-600',
          gradient: 'from-purple-600 via-purple-400 to-purple-500'
        };
      }
      return {
        border: 'border-primary/30',
        bg: 'bg-card',
        icon: null,
        pulse: 'bg-primary',
        text: 'text-primary',
        gradient: 'from-primary to-primary/60'
      };
  }
};

export default function Sponsorship() {
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null)

  const handlePackageSelect = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg)
  }

  const handlePaymentSuccess = () => {
    toast.success('Thank you for your sponsorship! Our team will contact you shortly.')
    setSelectedPackage(null)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 to-green-700 py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white text-xs font-medium">Limited Slots Available</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight"
            >
              Sponsorship Opportunities
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-sm md:text-base text-white/80 max-w-2xl mx-auto mb-4 leading-relaxed"
            >
              Join us in making a lasting impact. Choose from our range of sponsorship packages designed to maximize your visibility and engagement.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <Button
                size="lg"
                className="bg-white text-emerald-900 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 font-semibold px-6"
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Packages
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold px-6"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Us
                <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all duration-300 font-semibold px-6"
                onClick={() => window.open('/sponsorship-brochure.pdf', '_blank')}
              >
                Download Brochure
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Key Benefits Section */}
      <motion.section 
        className="py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Trophy,
                title: "Premium Recognition",
                description: "Gain prestigious recognition as a key supporter of climate action"
              },
              {
                icon: Users,
                title: "Network Access",
                description: "Connect with industry leaders and decision-makers"
              },
              {
                icon: Shield,
                title: "Brand Protection",
                description: "Associate with sustainable and responsible initiatives"
              },
              {
                icon: Star,
                title: "VIP Treatment",
                description: "Enjoy exclusive access to premium events and services"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="p-6 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <benefit.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Sponsorship Packages</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Choose the perfect package that aligns with your organization's goals and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => {
              const styles = getPackageStyles(pkg.name)
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <Card className={`relative overflow-hidden ${styles.border} ${styles.bg} h-full shadow-lg 
                    hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1
                    ${pkg.featured ? 'ring-2 ring-amber-500 ring-offset-2' : ''}`}>
                    {pkg.featured && (
                      <div className="absolute top-0 right-0 w-20 h-20">
                        <div className="absolute transform rotate-45 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-1 right-[-40px] top-[32px] w-[170px] text-center text-sm font-medium">
                          Featured
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {styles.icon}
                          <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                        </div>
                        {pkg.slots !== null && pkg.slots > 0 && (
                          <Badge className={`${styles.text} ${styles.bg} border ${styles.border}`}>
                            {pkg.slots} slots left
                          </Badge>
                        )}
                      </div>

                      <div className="mb-6">
                        <div className="text-3xl font-bold mb-2 text-gray-900">
                          {pkg.currency} {pkg.price}
                          {pkg.reservationFee && (
                            <span className="text-sm font-normal text-gray-600 block">
                              + {pkg.currency} {pkg.reservationFee} reservation fee
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
                      </div>

                      <div className="space-y-4 mb-6">
                        {pkg.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Check className={`w-5 h-5 ${styles.text} flex-shrink-0 mt-1`} />
                            <span className="text-gray-700 leading-relaxed">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 mt-auto">
                        <Button 
                          className={`w-full bg-gradient-to-r ${styles.gradient} text-white hover:opacity-90 
                            transition-all duration-300 shadow-lg hover:shadow-xl font-semibold
                            ${pkg.slots === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => pkg.slots !== 0 && handlePackageSelect(pkg)}
                          disabled={pkg.slots === 0}
                        >
                          {pkg.slots !== null && pkg.slots > 0 ? (
                            <>
                              Select Package
                              <span className="ml-2 text-sm opacity-90">
                                ({pkg.slots} slots left)
                              </span>
                            </>
                          ) : pkg.slots === 0 ? (
                            'Fully Booked'
                          ) : (
                            'Select Package'
                          )}
                        </Button>
                        <div className="flex items-center justify-center gap-2">
                          <WhatsAppButton packageName={pkg.name} price={pkg.price} />
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                          >
                            Contact Us
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Get in Touch</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ready to make an impact? Contact us to discuss your sponsorship options
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Payment Form Dialog */}
      <PaymentForm
        selectedPackage={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
