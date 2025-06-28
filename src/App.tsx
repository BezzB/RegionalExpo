import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './routes/Home'
import About from './routes/About'
import Contact from './routes/Contact'
import Events from './routes/Events'
import Programs from './routes/Programs'
import FirstLadyMarathon from './routes/FirstLadyMarathon'
import GalaBreakfast from './routes/GalaBreakfast'
import Sponsors from './routes/Sponsors'
import Sponsorship from './routes/Sponsorship'
import RegistrationTypeSelection from './routes/RegistrationTypeSelection'
import SponsorRegistration from './routes/Register'
import DelegateRegistration from './routes/DelegateRegistration'
import MarathonRegistration from './routes/MarathonRegistration'
import RegistrationSuccess from './routes/RegistrationSuccess'

// Admin routes
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './routes/admin/AdminDashboard'
import AdminLogin from './routes/admin/Login'
import AdminEvents from './routes/admin/Events'
import AdminSponsors from './routes/admin/Sponsors'
import AdminPartners from './routes/admin/Partners'
import AdminExhibitors from './routes/admin/Exhibitors'
import AdminAttendees from './routes/admin/Attendees'
import AdminPayments from './routes/admin/Payments'
import AdminSettings from './routes/admin/Settings'
import AdminNotifications from './routes/admin/Notifications'
import AdminSpeakers from './routes/admin/Speakers'
import AdminProfile from './routes/admin/Profile'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="events" element={<Events />} />
          <Route path="programs" element={<Programs />} />
          <Route path="programs/marathon" element={<FirstLadyMarathon />} />
          <Route path="programs/gala" element={<GalaBreakfast />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="sponsorship" element={<Sponsorship />} />
          
          {/* Registration Routes */}
          <Route path="register" element={<RegistrationTypeSelection />} />
          <Route path="register/sponsor" element={<SponsorRegistration />} />
          <Route path="register/delegate" element={<DelegateRegistration />} />
          <Route path="register/marathon" element={<MarathonRegistration />} />
          <Route path="registration-success" element={<RegistrationSuccess />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="sponsors" element={<AdminSponsors />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="exhibitors" element={<AdminExhibitors />} />
          <Route path="attendees" element={<AdminAttendees />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="speakers" element={<AdminSpeakers />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  )
} 