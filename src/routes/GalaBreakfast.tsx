import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CountdownTimer = () => {
  const targetDate = new Date('2025-07-10T08:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 justify-center">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Minutes" },
        { value: timeLeft.seconds, label: "Seconds" }
      ].map((item, index) => (
        <motion.div
          key={index}
          className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center min-w-[80px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="text-2xl font-bold text-white">{item.value}</div>
          <div className="text-xs text-white/70">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

const StickyRegistration = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 
            shadow-lg z-50 py-4 px-4"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="hidden md:block">
                <div className="text-sm text-gray-600">Early Bird Registration Ends in:</div>
                <div className="text-lg font-semibold text-amber-600">
                  <CountdownTimer />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-gray-900">KES 4,500</div>
                <div className="text-sm text-gray-600">per person</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full 
                  font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30
                  flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const GalaBreakfast = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const images = [
    '/assets/images/Gala_Breakfast.png',
    '/assets/images/Gala_Breakfast1.png'
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Kimani",
      role: "Climate Research Director",
      quote: "The Gala Breakfast provided an incredible platform for meaningful discussions about climate action. The connections made here have led to several collaborative projects across East Africa."
    },
    {
      name: "John Mwangi",
      role: "Sustainability Consultant",
      quote: "An exceptional gathering of minds committed to climate action. The networking opportunities were invaluable, and the discussions were both enlightening and actionable."
    },
    {
      name: "Dr. Elizabeth Omondi",
      role: "Environmental Policy Advisor",
      quote: "The perfect blend of meaningful dialogue and practical action. The breakfast series has become a cornerstone event for climate leadership in East Africa."
    }
  ];

  const handlePrevTestimonial = () => {
    setActiveTestimonialIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8]">
      {/* Hero Section with Image Carousel */}
      <div className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <motion.div className="relative w-full h-full">
            {images.map((image, index) => (
              <motion.img
                key={index}
                src={image}
                alt={`Gala Breakfast ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: activeImageIndex === index ? 1 : 0,
                  scale: activeImageIndex === index ? 1 : 1.1,
                }}
                transition={{ 
                  duration: 0.7,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          
          {/* Image Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 relative
                  ${activeImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {activeImageIndex === index && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-white"
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg space-y-4"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
                bg-white/10 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-white text-sm font-medium">July 10th, 2025 • Sarova Panafric Hotel</span>
            </motion.div>

            <motion.div className="space-y-2">
              <motion.h1 
                className="text-3xl md:text-5xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Gala Breakfast
                <motion.span 
                  className="block text-xl md:text-2xl font-light mt-1 text-amber-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Where Influence Meets Impact
                </motion.span>
              </motion.h1>

              {/* Add Countdown Timer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <CountdownTimer />
              </motion.div>

              <motion.p 
                className="text-base md:text-lg text-white/80 leading-relaxed max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Join influential leaders for an inspiring morning of networking and climate action.
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full 
                  font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30
                  flex items-center gap-2 group text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reserve Your Seat
                <motion.svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.button>
              <motion.button
                className="px-6 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white 
                  rounded-full font-medium transition-all duration-300 border border-white/30 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Brochure
              </motion.button>
            </motion.div>


          </motion.div>
        </div>
      </div>

      {/* Interactive Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="relative rounded-2xl overflow-hidden aspect-video"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src={images[1]} 
                alt="Networking" 
                className="w-full h-full object-cover"
              />
              {!isVideoPlaying && (
                <motion.button
                  className="absolute inset-0 flex items-center justify-center bg-black/40
                    hover:bg-black/50 transition-colors duration-300"
                  onClick={() => setIsVideoPlaying(true)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center 
                    justify-center shadow-lg">
                    <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </motion.button>
              )}
            </motion.div>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Experience the Atmosphere
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our Gala Breakfast offers more than just a meal - it's a carefully curated 
                experience bringing together East Africa's most influential leaders in climate 
                action and sustainable development.
              </p>
              <div className="space-y-4">
                {[
                  "Exclusive networking opportunities",
                  "Gourmet breakfast experience",
                  "Inspiring keynote speakers",
                  "Interactive panel discussions"
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3 text-gray-700"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" 
                      stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative">
        {/* Event Overview */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-amber-100 text-amber-800 
                text-sm font-medium mb-4">
                Event Overview
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Attend the Gala Breakfast?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Experience an exclusive morning of networking, inspiration, and impact. Connect with 
                industry leaders while contributing to environmental conservation initiatives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🤝",
                  title: "Elite Networking",
                  description: "Connect with influential leaders and decision-makers in an intimate setting"
                },
                {
                  icon: "🍽️",
                  title: "Culinary Excellence",
                  description: "Enjoy a carefully curated breakfast menu featuring local delicacies"
                },
                {
                  icon: "🌱",
                  title: "Meaningful Impact",
                  description: "Your participation directly supports climate action initiatives"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl 
                  transition-all duration-300 group">
                  <span className="text-4xl mb-6 block transform group-hover:scale-110 
                    transition-transform duration-300">
                    {feature.icon}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pre-Conference Events */}
        <section className="py-20 bg-gradient-to-b from-amber-50/50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-amber-100 text-amber-800 
                text-sm font-medium mb-4">
                Pre-Conference Events
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Secure The Moments
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Climate Tree Planting Drive",
                  description: "Restoring Nature, One Tree at a Time",
                  price: "Free",
                  features: [
                    "Community-driven initiative",
                    "Environmental restoration",
                    "Climate resilience",
                    "Sustainable ecosystems"
                  ]
                },
                {
                  title: "Gala Dinner",
                  description: "For Climate Champions",
                  price: "KES 9,500",
                  features: [
                    "Formal fundraising dinner",
                    "Awards ceremony",
                    "Networking opportunities",
                    "Entertainment"
                  ]
                },
                {
                  title: "Business Leaders Conference",
                  description: "Annual Leadership Summit",
                  price: "KES 4,500",
                  features: [
                    "Industry insights",
                    "Innovation showcase",
                    "Entrepreneurship focus",
                    "Strategic networking"
                  ]
                }
              ].map((event, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg 
                  hover:shadow-xl transition-all duration-300">
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="text-2xl font-bold text-amber-600 mb-6">{event.price}</div>
                    <ul className="space-y-3 mb-8">
                      {event.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-gray-600">
                          <svg className="w-5 h-5 text-amber-500" fill="none" 
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" 
                              strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 
                      text-white rounded-lg font-medium transition-colors duration-300">
                      Get Ticket Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Testimonials Section */}
        <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What Past Attendees Say
                </h2>
                <p className="text-lg text-gray-600">
                  Hear from leaders who attended our previous events
                </p>
              </div>

              <div className="relative">
                <motion.div 
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonials[activeTestimonialIndex].name}</h4>
                      <p className="text-sm text-gray-600">{testimonials[activeTestimonialIndex].role}</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 leading-relaxed mb-6">
                    {testimonials[activeTestimonialIndex].quote}
                  </blockquote>
                  <div className="flex items-center gap-2">
                    <motion.button
                      className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center 
                        justify-center text-gray-600 hover:text-amber-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePrevTestimonial}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                    <motion.button
                      className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center 
                        justify-center text-gray-600 hover:text-amber-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleNextTestimonial}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-amber-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Stay Updated!
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Subscribe to our newsletter for event updates, speaker announcements, and exclusive offers.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-4 rounded-full bg-white/10 border border-white/20 
                    focus:outline-none focus:border-white/40 text-white placeholder:text-white/40
                    min-w-[300px]"
                />
                <button className="px-8 py-4 bg-white text-amber-900 rounded-full font-medium 
                  hover:bg-amber-50 transition-colors duration-300">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Location Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-amber-100 text-amber-800 
                text-sm font-medium mb-4">
                Venue Details
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join Us at Sarova Stanley
              </h2>
              <p className="text-lg text-gray-600">
                Experience luxury and heritage at Nairobi's first luxury hotel
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="aspect-video relative">
                <img
                  src="/assets/images/sarova-stanley.jpg"
                  alt="Sarova Stanley Hotel"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">Kimathi Street, CBD, Nairobi</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://maps.google.com/?q=Sarova+Stanley+Hotel+Nairobi+Kimathi+Street"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm hover:text-amber-300
                        transition-colors duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on Google Maps
                    </a>
                    <span className="text-white/60">|</span>
                    <div className="flex items-center gap-1 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      8:00 AM - 11:00 AM
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: "🚗",
                    title: "Parking",
                    description: "Complimentary valet parking available"
                  },
                  {
                    icon: "🌐",
                    title: "Accessibility",
                    description: "Wheelchair accessible venue"
                  },
                  {
                    icon: "🔒",
                    title: "Security",
                    description: "24/7 security and health protocols"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-2xl mb-2 block">{feature.icon}</span>
                    <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Add Sticky Registration */}
      <StickyRegistration />
    </div>
  );
};

export default GalaBreakfast;