import { Bell, User } from 'lucide-react'

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-end h-full px-6">
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
} 