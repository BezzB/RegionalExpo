import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface Session {
  time: string
  title: string
  description?: string
  speakers?: string[]
  location?: string
}

interface DaySchedule {
  date: string
  theme?: string
  sessions: Session[]
}

interface ExhibitionInfo {
  date: string
  description: string
  time: string
  notes: string[]
}

const preSummitMobilization: DaySchedule = {
  date: "27 June 2025",
  sessions: [
    {
      time: "08:00–10:00",
      title: "Breakfast Meeting & Resource Mobilization",
      description: "Welcome by Worldlink & LREB leadership, Presentation of summit objectives, Q&A & networking",
      location: "Sarova Panafric, Nairobi"
    }
  ]
}

const preSummitActivities: DaySchedule = {
  date: "3 September 2025",
  sessions: [
    {
      time: "06:00–07:00",
      title: "Marathon Registration",
      location: "MMUST"
    },
    {
      time: "07:00–09:00",
      title: "First Lady Marathon \"A Race for the Planet\""
    },
    {
      time: "09:00–10:30",
      title: "Tree‑Planting Ceremony",
      description: "Led by H.E. the First Lady",
      location: "Kakamega Forest"
    },
    {
      time: "10:30–12:00",
      title: "Post‑run cool‑down & community engagement fair"
    },
    {
      time: "18:00–21:00",
      title: "Pre‑Summit Dinner Concert",
      location: "MMUST Open Air Arena"
    }
  ]
}

const mainSummitDay1: DaySchedule = {
  date: "4 September 2025",
  theme: "Official Opening & Forest Conservation",
  sessions: [
    {
      time: "08:00–09:00",
      title: "Delegate Registration & Welcome Coffee"
    },
    {
      time: "09:00–09:15",
      title: "National Anthem & Moment of Silence"
    },
    {
      time: "09:15–09:45",
      title: "Opening Remarks",
      speakers: ["First Lady, Republic of Kenya"]
    },
    {
      time: "09:45–10:30",
      title: "Keynote Address",
      speakers: ["Dr. Deborah Mulongo, CS Environment"]
    },
    {
      time: "10:30–11:00",
      title: "Marathon Flag‑Off Ceremony"
    },
    {
      time: "11:00–12:30",
      title: "Plenary Panel: \"Mobilizing Low‑Carbon Transitions\""
    },
    {
      time: "12:30–14:00",
      title: "Networking Lunch & Exhibitions Open"
    },
    {
      time: "14:00–15:30",
      title: "Breakout Sessions",
      description: "Choose one:\n• Climate Finance & NDCs\n• Nature‑Based Solutions & Indigenous Rights"
    },
    {
      time: "15:30–16:00",
      title: "Coffee Break & Side‑Events"
    },
    {
      time: "16:00–17:30",
      title: "Breakout Sessions",
      description: "Choose one:\n• Geo‑Spatial Monitoring Systems\n• Carbon Markets"
    },
    {
      time: "17:30–19:00",
      title: "Welcome Reception & Poster Sessions"
    }
  ]
}

const mainSummitDay2: DaySchedule = {
  date: "5 September 2025",
  theme: "Solutions & Innovation",
  sessions: [
    {
      time: "08:30–09:00",
      title: "Morning Coffee & Exhibitions"
    },
    {
      time: "09:00–09:45",
      title: "Keynote Roundtable",
      description: "LREB Governors, chaired by FCPA Fernandez Barasa"
    },
    {
      time: "09:45–11:15",
      title: "Panel: \"Financing Climate Action\"",
      description: "Green bonds, climate funds, private investment"
    },
    {
      time: "11:15–11:45",
      title: "Coffee Break & Side‑Events"
    },
    {
      time: "11:45–13:15",
      title: "Showcase: Climate Tech & Innovation Expo Tours"
    },
    {
      time: "13:15–14:30",
      title: "Networking Lunch & Exhibitions"
    },
    {
      time: "14:30–16:00",
      title: "Workshops",
      description: "Choose one:\n• Community‑Led Adaptation Models\n• Energy Efficiency & Mitigation Strategies"
    },
    {
      time: "16:00–16:30",
      title: "Coffee & Side‑Events"
    },
    {
      time: "16:30–18:00",
      title: "Masterclasses",
      description: "90 mins each:\n• Nature‑Based Solutions\n• Policy Reform for Sustainable Adaptation"
    },
    {
      time: "18:00–20:00",
      title: "Evening Cultural Event"
    }
  ]
}

const mainSummitDay3: DaySchedule = {
  date: "6 September 2025",
  theme: "Action Plans & Way Forward",
  sessions: [
    {
      time: "08:30–09:00",
      title: "Morning Coffee & Exhibitions"
    },
    {
      time: "09:00–09:30",
      title: "Presidential Keynote",
      speakers: ["H.E. William Ruto, President of Kenya"]
    },
    {
      time: "09:30–11:00",
      title: "Working Groups: Regional Action Plan Development"
    },
    {
      time: "11:00–11:30",
      title: "Coffee Break & Side‑Events"
    },
    {
      time: "11:30–12:30",
      title: "Plenary: \"Communicating our Regional Position\""
    },
    {
      time: "12:30–14:00",
      title: "Networking Lunch & Exhibitions"
    },
    {
      time: "14:00–15:00",
      title: "High‑Level Plenary: Presentation & Endorsement of Action Plans"
    },
    {
      time: "15:00–15:30",
      title: "Closing Remarks & Kakamega Declaration Launch"
    },
    {
      time: "15:30–17:00",
      title: "Cultural Networking & Farewell Reception"
    }
  ]
}

const exhibitions: ExhibitionInfo = {
  date: "4-6 September 2025",
  description: "Main Exhibition Hall open (50+ booths)",
  time: "10:00–18:00 daily",
  notes: [
    "Side‑Events (90–120 mins): morning and afternoon slots alongside main sessions",
    "Interpretation services and technical support throughout"
  ]
}

const keyOutputs = [
  "Kakamega Declaration on climate governance",
  "Framework for a New Global Financial Deal",
  "Green investment commitments across LREB",
  "Roadmaps for mitigation, adaptation, and resilience",
  "Amplified African voice in global climate negotiations"
]

export default function ProgramSchedule() {
  const [selectedDay, setSelectedDay] = useState("pre-summit")

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Complete Program Schedule
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our comprehensive program of events, sessions, and activities throughout the expo
        </p>
      </div>

      <Tabs defaultValue="pre-summit" className="w-full" onValueChange={setSelectedDay}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2 mb-8 bg-white/50 p-1 rounded-lg">
          <TabsTrigger value="pre-summit" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
            Pre-Summit
          </TabsTrigger>
          <TabsTrigger value="pre-activities" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
            Activities
          </TabsTrigger>
          <TabsTrigger value="day1" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
            Day 1
          </TabsTrigger>
          <TabsTrigger value="day2" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
            Day 2
          </TabsTrigger>
          <TabsTrigger value="day3" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
            Day 3
          </TabsTrigger>
          <TabsTrigger value="exhibitions" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
            Exhibitions
          </TabsTrigger>
        </TabsList>

        <div className="space-y-8">
          <TabsContent value="pre-summit">
            <DayScheduleView schedule={preSummitMobilization} />
          </TabsContent>

          <TabsContent value="pre-activities">
            <DayScheduleView schedule={preSummitActivities} />
          </TabsContent>

          <TabsContent value="day1">
            <DayScheduleView schedule={mainSummitDay1} />
          </TabsContent>

          <TabsContent value="day2">
            <DayScheduleView schedule={mainSummitDay2} />
          </TabsContent>

          <TabsContent value="day3">
            <DayScheduleView schedule={mainSummitDay3} />
          </TabsContent>

          <TabsContent value="exhibitions">
            <ExhibitionsView exhibitions={exhibitions} />
          </TabsContent>
        </div>
      </Tabs>

      <div className="mt-12 bg-green-50 rounded-xl p-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Key Outputs & Deliverables</h3>
        <ul className="space-y-3">
          {keyOutputs.map((output, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700">
              <ChevronRight className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{output}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function DayScheduleView({ schedule }: { schedule: DaySchedule }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-green-50 p-6">
        <div className="flex items-center gap-2 text-green-800 mb-2">
          <Calendar className="w-5 h-5" />
          <span className="font-medium">{schedule.date}</span>
        </div>
        {schedule.theme && (
          <h3 className="text-xl font-semibold text-gray-900">
            Theme: {schedule.theme}
          </h3>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {schedule.sessions.map((session, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-24 text-gray-500">
                <Clock className="w-4 h-4 inline-block mr-1" />
                {session.time}
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {session.title}
                </h4>
                {session.description && (
                  <p className="text-gray-600 whitespace-pre-line mb-3">
                    {session.description}
                  </p>
                )}
                {session.speakers && (
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Users className="w-4 h-4" />
                    <span>{session.speakers.join(", ")}</span>
                  </div>
                )}
                {session.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{session.location}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ExhibitionsView({ exhibitions }: { exhibitions: ExhibitionInfo }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-green-50 p-6">
        <div className="flex items-center gap-2 text-green-800 mb-2">
          <Calendar className="w-5 h-5" />
          <span className="font-medium">{exhibitions.date}</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Exhibitions & Side Events
        </h3>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-900 mb-4">
          <Clock className="w-5 h-5" />
          <span className="font-medium">{exhibitions.time}</span>
          <span className="text-gray-600">—</span>
          <span>{exhibitions.description}</span>
        </div>

        <div className="space-y-4">
          {exhibitions.notes.map((note: string, index: number) => (
            <div key={index} className="flex items-start gap-2 text-gray-600">
              <ChevronRight className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 