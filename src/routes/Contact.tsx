import { motion } from 'framer-motion'
import { ContactForm } from '../components/ContactForm'
import { Button } from '../components/ui/button'
import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-primary text-white py-20"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            Get in Touch
          </h1>
          <p className="text-xl text-center max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our events, 
            sponsorship opportunities, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
      </motion.div>

      {/* Contact Information */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
            <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Website</h3>
            <a href="https://www.regionalclimatechange.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              www.regionalclimatechange.com
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
            <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Phone Numbers</h3>
            <div className="space-y-1">
              <p className="text-gray-600">+254 721 997 953</p>
              <p className="text-gray-600">+254 718 554 004</p>
              <p className="text-gray-600">+254 724 556 401</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
            <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Email Address</h3>
            <a href="mailto:info@regionalclimatexpo.com" className="text-primary hover:underline">
              info@regionalclimatexpo.com
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
            <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Working Hours</h3>
            <p className="text-gray-600">Mon - Fri: 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8191673767!2d36.82115931475403!3d-1.282099999063461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d2a49f4b4d%3A0x58f0861d4664e3a2!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1647881234567!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}
