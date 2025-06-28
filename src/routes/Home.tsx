import { useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef } from 'react'

const socialLinks = [
  { name: 'Twitter', icon: '𝕏', href: '#' },
  { name: 'Facebook', icon: 'f', href: '#' },
  { name: 'Instagram', icon: '📸', href: '#' },
  { name: 'LinkedIn', icon: 'in', href: '#' }
]

const footerLinks = {
  'Quick Links': [
    { name: 'About Us', href: '/about' },
    { name: 'Program', href: '/program' },
    { name: 'Speakers', href: '/speakers' },
    { name: 'Sponsors', href: '/sponsors' }
  ],
  'Resources': [
    { name: 'Press Kit', href: '/press' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Blog', href: '/blog' }
  ],
  'Contact': [
    { name: 'info@regionalexpo.com', href: 'mailto:info@regionalexpo.com' },
    { name: '+254 700 000000', href: 'tel:+254700000000' },
    { name: 'MMUST, Kakamega', href: '#' }
  ]
}

interface Event {
  title: string
  date: string
  time: string
  description: string
  icon: string
  location: string
  category: string
}

const mainEvents: Event[] = [
  {
    title: "Tree Planting Ceremony",
    date: "September 3, 2025",
    time: "9:00 AM - 12:00 PM",
    description: "Join the First Lady and LREB county officials in restoring the Kakamega Forest ecosystem. Plant indigenous trees and participate in conservation education.",
    icon: "🌳",
    location: "Kakamega Forest",
    category: "Environment"
  },
  {
    title: "First Lady Marathon",
    date: "September 3, 2025",
    time: "2:00 PM - 5:00 PM",
    description: "Race for the Planet - Support environmental sustainability and preserve the only tropical forest remaining in East Africa.",
    icon: "🏃‍♀️",
    location: "Kakamega Town",
    category: "Sports"
  },
  {
    title: "Pre-Summit Concert",
    date: "September 3, 2025",
    time: "7:00 PM - 10:00 PM",
    description: "Experience top musicians from Lake Region Economic Bloc in a celebration of unity and environmental consciousness.",
    icon: "🎵",
    location: "MMUST Grounds",
    category: "Entertainment"
  }
]

const keyFeatures = [
  {
    title: "Environmental Focus",
    description: "Dedicated to climate resilience and sustainable practices across East Africa",
    icon: "🌿"
  },
  {
    title: "Regional Impact",
    description: "Uniting the Lake Region Economic Bloc for environmental action",
    icon: "🤝"
  },
  {
    title: "Expert Speakers",
    description: "Leading voices in climate science, policy, and innovation",
    icon: "🎯"
  },
  {
    title: "Interactive Sessions",
    description: "Engaging workshops, panels, and networking opportunities",
    icon: "💡"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null)
  useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  })
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden -mt-24 pt-24">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster="/assets/images/kakamega-forest.jpg"
            >
              <source src="/assets/images/events_breakfast (1).mp4" type="video/mp4" />
            </video>
          </div>
          
          {/* Enhanced Overlays for Better Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.15)_0%,rgba(255,255,255,0)_60%)]" />
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(0,0,0,0)_0deg,rgba(0,0,0,0.3)_180deg,rgba(0,0,0,0)_360deg)]" />
        </div>

        <div className="relative container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Event Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 inline-block"
            >
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 
                backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wide
                shadow-[0_2px_10px_rgba(0,255,0,0.1)]">
                September 3-6, 2025 • MMUST, Kakamega
              </span>
            </motion.div>

            {/* Main Content */}
            <div className="space-y-6 backdrop-blur-md bg-black/10 p-8 rounded-3xl border border-white/10
              shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_48px_rgba(0,0,0,0.25)] 
              transition-all duration-500 group">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight"
              >
                <span className="inline-block bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                  Regional Climate Change
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-green-300 via-emerald-300 to-green-200 bg-clip-text text-transparent
                  group-hover:from-green-200 group-hover:via-emerald-300 group-hover:to-green-300 transition-all duration-500">
                  & AgriExpo 2025
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed font-light"
              >
                Shaping East Africa's Climate Future Through Innovation and Collaboration
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 
                    blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
                  <Link
                    to="/sponsorship"
                    className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 
                      rounded-full text-lg font-semibold inline-flex items-center gap-2 hover:shadow-2xl 
                      hover:shadow-green-500/30 transition-all duration-300"
                  >
                    Become a Sponsor
                    <motion.span
                      initial={{ x: 0 }}
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-xl"
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/program"
                    className="relative bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 
                      rounded-full text-lg font-semibold inline-flex items-center gap-3
                      hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-xl"
                  >
                    View Program
                    <span className="text-green-300">•</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-white/10"
              >
                {[
                  { label: "Counties", value: "47+" },
                  { label: "Speakers", value: "50+" },
                  { label: "Stakeholders", value: "100+" },
                  { label: "Attendees", value: "1000+" }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-2">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1"
            >
              <motion.div
                animate={{ height: ["20%", "80%", "20%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 bg-white/50 rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About the Expo */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-black">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.15)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(0,0,0,0)_0deg,rgba(34,197,94,0.05)_180deg,rgba(0,0,0,0)_360deg)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-20"
            >
              <motion.span 
                className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 
                  text-green-400 text-sm font-medium mb-6 border border-green-500/10 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Discover Our Vision
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                About the Expo
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-8"
              >
                <motion.div 
                  className="backdrop-blur-xl bg-white/[0.02] p-8 rounded-2xl border border-white/[0.05]
                    hover:bg-white/[0.05] transition-all duration-500 group relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">🌍</span>
                      <h3 className="text-xl font-semibold text-green-400">Our Mission</h3>
                    </div>
                    <p className="text-lg md:text-xl leading-relaxed text-white/80 group-hover:text-white/90 transition-colors duration-300">
                      The Regional Climate Change and AgriExpo is a premier East African event championing practical 
                      and policy-driven climate action. Organized by Worldlink Event & Environment Management in 
                      partnership with the Lake Region Economic Bloc (LREB) and hosted by the County Government of 
                      Kakamega, the Expo brings together diverse stakeholders to accelerate climate adaptation, 
                      resilience, and innovation in agriculture and environmental sustainability.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="backdrop-blur-xl bg-white/[0.02] p-8 rounded-2xl border border-white/[0.05]
                    hover:bg-white/[0.05] transition-all duration-500 group relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl">🎯</span>
                      <h3 className="text-xl font-semibold text-green-400">Our Impact</h3>
                    </div>
                    <p className="text-lg md:text-xl leading-relaxed text-white/80 group-hover:text-white/90 transition-colors duration-300">
                      It addresses national environmental challenges through the collaborative lens of 
                      Kenya's 47 counties, corporate organizations, artists, architects, filmmakers, scientists, 
                      thought leaders, and designers—advancing the climate dialogue and driving co-created, actionable 
                      solutions to the global climate crisis.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="relative group"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-2xl 
                  opacity-20 group-hover:opacity-30 blur-2xl transition-all duration-500" />
                <div className="relative rounded-2xl overflow-hidden transform group-hover:scale-[1.02] 
                  transition-transform duration-500 shadow-[0_0_40px_rgba(0,255,0,0.1)]">
                  <img
                    src="/assets/images/expoImage.png"
                    alt="Regional Climate Expo"
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full 
                    group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t 
                    from-black/80 to-transparent">
                    <p className="text-white/90 text-sm font-medium">
                      Experience the future of climate innovation at MMUST, Kakamega
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Key Participants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { title: "Counties", number: "47", icon: "🏛️" },
                { title: "Stakeholders", number: "100+", icon: "👥" },
                { title: "Organizations", number: "50+", icon: "🏢" },
                { title: "Industries", number: "20+", icon: "🌱" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 text-center border border-white/10
                    hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="text-5xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {item.number}
                  </div>
                  <div className="text-white/70 font-medium group-hover:text-white/90 transition-colors duration-300">
                    {item.title}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="py-24 bg-white relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.05)_0%,rgba(255,255,255,0)_50%)]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015]" />
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
        
        <motion.div 
          className="container mx-auto px-4 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
            variants={itemVariants}
          >
            Our Offerings
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Gala Dinner",
                description: "Attend our exclusive fundraising gala with industry leaders.",
                link: "/gala",
                icon: "🎭"
              },
              {
                title: "Sponsorship",
                description: "Maximize visibility by becoming our official sponsor.",
                link: "/sponsors",
                icon: "🤝"
              },
              {
                title: "Pre-Conference",
                description: "Workshops and networking to kick off the event.",
                link: "/pre-conference",
                icon: "📊"
              },
              {
                title: "Main Event",
                description: "Be part of impactful keynotes, panels, and exhibitions.",
                link: "/program",
                icon: "🎯"
              }
            ].map((offering, index) => (
              <motion.div
                key={index}
                className="group"
                variants={itemVariants}
              >
                <Link to={offering.link}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all 
                    duration-300 h-full transform hover:-translate-y-1 border border-gray-100
                    hover:border-green-100 hover:bg-green-50/50">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {offering.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-green-700 
                      transition-colors duration-300">{offering.title}</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {offering.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Key Features */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <motion.div className="text-center mb-20">
              <motion.span 
                className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 
                  text-green-400 text-sm font-medium mb-6 border border-green-500/10 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Why Attend?
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Key Features
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group"
                  variants={itemVariants}
                >
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all 
                    duration-300 h-full transform hover:-translate-y-1 border border-gray-100
                    hover:border-green-100 hover:bg-green-50/50">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-green-700 
                      transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Events */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-20">
            <motion.span 
              className="inline-block px-6 py-2 rounded-full bg-green-50 text-green-600 
                text-lg font-medium mb-4 border border-green-100 shadow-sm shadow-green-100/50"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Mark Your Calendar
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r 
                from-green-800 to-green-600 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Event Schedule
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full mb-8" />
            <p className="max-w-2xl mx-auto text-gray-600 text-lg">
              Join us for four days of inspiring talks, workshops, and activities focused on climate action and environmental sustainability.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {mainEvents.map((event, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={itemVariants}
              >
                {/* Timeline connector */}
                {index !== mainEvents.length - 1 && (
                  <div className="absolute left-[47px] top-[88px] bottom-0 w-0.5 bg-gradient-to-b from-green-200 to-green-100" />
                )}
                
                <div className="flex items-start gap-8 mb-12">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-green-50 to-white 
                    shadow-lg shadow-green-100/50 border border-green-100 group-hover:shadow-xl group-hover:border-green-200 
                    transition-all duration-300 flex items-center justify-center">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {event.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all 
                    duration-300 border border-gray-100 hover:border-green-100 group-hover:bg-gradient-to-br 
                    group-hover:from-white group-hover:to-green-50/30">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-600">
                        {event.category}
                      </span>
                      <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-700 
                      transition-colors duration-300 mb-3">{event.title}</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="mt-6">
                      <button className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700 
                        transition-colors duration-300 group/btn">
                        Learn More
                        <span className="transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-16 text-center"
            variants={itemVariants}
          >
            <Link
              to="/program"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-green-600 text-white 
                font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-600/20 
                hover:shadow-xl hover:shadow-green-600/30 transform hover:-translate-y-0.5"
            >
              View Full Schedule
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-16">Our Partners & Sponsors</h2>
            <p className="text-gray-600 text-xl">No sponsors available yet.</p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Stay Updated!</h2>
            <p className="text-xl text-gray-600 mb-12">
              Subscribe to our newsletter and never miss event updates, speaker announcements, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-green-500"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-green-500 text-white rounded-full font-semibold
                  hover:bg-green-600 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        {/* Main Footer */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link to="/" className="inline-block">
                <h3 className="text-2xl font-bold text-white">Regional Climate Expo</h3>
              </Link>
              <p className="text-sm text-white/60 leading-relaxed">
                Join us in shaping East Africa's climate future through innovation, 
                collaboration, and sustainable practices.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                      hover:bg-white/20 transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <span className="text-sm font-semibold">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-6">
                <h4 className="text-lg font-semibold text-white">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-white/60 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Subscribe to Our Newsletter
                </h4>
                <p className="text-sm text-white/60">
                  Stay updated with the latest news and announcements
                </p>
              </div>
              <form className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                    focus:outline-none focus:border-white/40 text-white placeholder:text-white/40
                    min-w-[240px]"
                />
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-white text-gray-900 font-semibold
                    hover:bg-white/90 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
              <p>© 2025 Regional Climate Expo. All rights reserved.</p>
              <div className="flex gap-6">
                <Link to="/privacy" className="hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors duration-300">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}
