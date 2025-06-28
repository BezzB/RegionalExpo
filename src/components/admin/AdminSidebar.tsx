import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Image,
  Calendar,
  Users,
  Handshake,
  Building2,
  UserCheck,
  Settings as SettingsIcon,
  Bell,
  LogOut,
  CreditCard,
  Timer
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import supabase from '@/lib/supabase'

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/gallery', label: 'Gallery', icon: Image },
  { path: '/admin/events', label: 'Events', icon: Calendar },
  { path: '/admin/speakers', label: 'Speakers', icon: Users },
  { path: '/admin/sponsors', label: 'Sponsors', icon: Handshake },
  { path: '/admin/partners', label: 'Partners', icon: Building2 },
  { path: '/admin/exhibitors', label: 'Exhibitors', icon: Building2 },
  { path: '/admin/attendees', label: 'Attendees', icon: UserCheck },
  { path: '/admin/marathon', label: 'Marathon', icon: Timer },
  { path: '/admin/payments', label: 'Payments', icon: CreditCard },
  { path: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  { path: '/admin/notifications', label: 'Notifications', icon: Bell }
]

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      navigate('/admin/login')
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-20">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
} 