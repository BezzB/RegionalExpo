import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Tag, ChevronDown, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

// Program data structure
interface Program {
  id: string
  title: string
  date: string
  time: string
  location: string
  track: string
  capacity: string
  description: string
  speakers: Array<{
    name: string
    role: string
    image: string
  }>
  tags: string[]
}

// Sample program data
const programs: Program[] = [
  {
    id: '1',
    title: 'Opening Ceremony & Keynote',
    date: 'September 3, 2025',
    time: '9:00 AM - 10:30 AM',
    location: 'Main Auditorium, MMUST',
    track: 'Main Event',
    capacity: '500 attendees',
    description: 'Join us for the grand opening of the Regional Climate Change & AgriExpo 2025, featuring keynote speeches from distinguished leaders in climate action.',
    speakers: [
      {
        name: 'Dr. Sarah Mwangi',
        role: 'Climate Policy Expert',
        image: '/images/speakers/placeholder.jpg'
      }
    ],
    tags: ['Opening', 'Keynote', 'Climate Policy']
  },
  {
    id: '2',
    title: 'Sustainable Agriculture Workshop',
    date: 'September 3, 2025',
    time: '11:00 AM - 12:30 PM',
    location: 'Innovation Hub',
    track: 'Agriculture',
    capacity: '200 attendees',
    description: 'Learn about cutting-edge sustainable farming practices and climate-smart agriculture techniques.',
    speakers: [
      {
        name: 'Prof. James Ochieng',
        role: 'Agricultural Scientist',
        image: '/images/speakers/placeholder.jpg'
      }
    ],
    tags: ['Agriculture', 'Sustainability', 'Workshop']
  },
  {
    id: '3',
    title: 'Climate Tech Innovation Showcase',
    date: 'September 3, 2025',
    time: '2:00 PM - 4:00 PM',
    location: 'Tech Pavilion',
    track: 'Technology',
    capacity: '300 attendees',
    description: 'Experience the latest technologies driving climate action and environmental sustainability.',
    speakers: [
      {
        name: 'Eng. Patricia Wekesa',
        role: 'CleanTech Innovator',
        image: '/images/speakers/placeholder.jpg'
      }
    ],
    tags: ['Technology', 'Innovation', 'CleanTech']
  }
]

// Available tracks for filtering
const tracks = ['All Tracks', 'Main Event', 'Agriculture', 'Technology', 'Policy', 'Community']

export default function Programs() {
  const [selectedTrack, setSelectedTrack] = useState('All Tracks')
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null)

  const filteredPrograms = selectedTrack === 'All Tracks'
    ? programs
    : programs.filter(program => program.track === selectedTrack)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20"
    >
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 
            text-green-400 text-sm font-medium mb-6 border border-green-500/10">
            September 3-6, 2025
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Event Program</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore our comprehensive program of keynotes, workshops, and interactive sessions
            designed to address climate change and agricultural innovation.
          </p>
        </motion.div>

        {/* Track Filter */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Filter by Track:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {tracks.map((track) => (
              <motion.button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${selectedTrack === track
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {track}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Program Timeline */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {filteredPrograms.map((program) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <div 
                  className={`bg-gray-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50
                    transition-all duration-300 hover:border-green-500/30 cursor-pointer
                    ${expandedProgram === program.id ? 'shadow-2xl shadow-green-500/10' : 'shadow-lg'}`}
                  onClick={() => setExpandedProgram(expandedProgram === program.id ? null : program.id)}
                >
                  {/* Program Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 
                          text-green-400 mb-3">
                          {program.track}
                        </span>
                        <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {program.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {program.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {program.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {program.capacity}
                          </div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedProgram === program.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedProgram === program.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-700/50"
                      >
                        <div className="p-6">
                          <p className="text-gray-400 mb-6">{program.description}</p>
                          
                          {/* Speakers */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-300 mb-3">Speakers:</h4>
                            <div className="flex items-center gap-4">
                              {program.speakers.map((speaker) => (
                                <div key={speaker.name} className="flex items-center gap-3">
                                  <img
                                    src={speaker.image}
                                    alt={speaker.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div>
                                    <div className="font-medium">{speaker.name}</div>
                                    <div className="text-sm text-gray-400">{speaker.role}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tags */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-3">Topics:</h4>
                            <div className="flex flex-wrap gap-2">
                              {program.tags.map((tag) => (
                                <div
                                  key={tag}
                                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300"
                                >
                                  <div className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
