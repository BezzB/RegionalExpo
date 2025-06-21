import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import supabase from '../lib/supabase'
import { CalendarIcon, MapPinIcon, Clock, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProgramSchedule from '@/components/ProgramSchedule'
import { cn } from '@/lib/utils'

interface Event {
  id: string
  title: string
  start_date: string
  end_date: string
  location: string
  description: string
  image_url: string | null
  status: string
  event_type: string
  registration_url: string | null
  created_at: string
}

const featuredEvents = [
  {
    id: "summit",
    title: "The Main Climate Change Summit",
    date: "September 4-6, 2025",
    location: "Masinde Muliro University of Science and Technology (MMUST)",
    description: "A high-level, multi-stakeholder forum designed to drive strategic dialogue, policy development, and actionable commitments on climate resilience across East Africa. The summit brings together government leaders, development partners, scientists, private sector innovators, community leaders, and youth voices.",
    image_url: "/images/events/climate-summit.jpg"
  },
  {
    id: "marathon",
    title: "First Lady's Marathon - Race for the Planet",
    date: "September 3, 2025",
    location: "MMUST & Kakamega Forest",
    description: "Join H.E. the First Lady for a marathon dedicated to environmental conservation, followed by a tree-planting ceremony at Kakamega Forest. This event symbolizes our commitment to climate action through community engagement.",
    image_url: "/images/events/fladymarathon.jpeg"
  },
  {
    id: "gala",
    title: "Post-Summit Gala Dinner",
    date: "September 6, 2025",
    location: "Golf Hotel, Kakamega",
    description: "A prestigious evening of celebration, reflection, and recognition. The dinner will honor key stakeholders, partners, and climate champions, with special attendance by the President of the Republic of Kenya.",
    image_url: "/images/events/gala-dinner.jpg"
  }
]

export default function Events() {
  const scrollToSchedule = () => {
    const scheduleSection = document.getElementById('schedule')
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const { data: events = [], isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true })

      if (error) {
        console.error('Error fetching events:', error)
        throw error
      }
      return data || []
    },
    retry: 1
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-4">Unable to load events. Please try again.</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-green-900 to-green-800 text-white">
        <div 
          className="absolute inset-0 bg-black/20 mix-blend-overlay"
          style={{ 
            backgroundImage: 'url("/grid.svg")',
            backgroundRepeat: 'repeat',
            opacity: 0.1 
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              {...fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            >
              Regional Climate Change & AgriExpo Events
            </motion.h1>
            <motion.p 
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl mb-10 text-gray-100 leading-relaxed"
            >
              Join us for a series of impactful events focused on climate action and sustainable agriculture
            </motion.p>
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={scrollToSchedule}
                className="bg-white text-green-900 hover:bg-green-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                View Program Schedule
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToSchedule}
                className="border-2 border-white text-white hover:bg-white/10 font-semibold transition-colors"
              >
                <Clock className="w-5 h-5 mr-2" />
                View Full Schedule
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Events Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Featured Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore our key events designed to bring together leaders, innovators, and stakeholders in climate action and sustainable agriculture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }
                }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <CalendarIcon className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                    <span className="font-medium">{event.location}</span>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3 hover:line-clamp-none transition-all duration-300">
                    {event.description}
                  </p>
                  <Button
                    onClick={scrollToSchedule}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <span className="flex items-center justify-center">
                      View Schedule
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Events Grid */}
      {events.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">All Events</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Browse through all our upcoming events and activities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    animate: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 }
                    }
                  }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    <img
                      src={event.image_url || '/images/events/placeholder.jpg'}
                      alt={event.title}
                      className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <CalendarIcon className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                      <span className="font-medium">
                        {new Date(event.start_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPinIcon className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-3 hover:line-clamp-none transition-all duration-300">
                      {event.description}
                    </p>
                    {event.registration_url && (
                      <Button
                        asChild
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <a 
                          href={event.registration_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          Register Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Schedule Section */}
      <section id="schedule" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <ProgramSchedule />
          </div>
        </div>
      </section>
    </div>
  )
}
