import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

interface AdminLayoutProps {
  children?: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <AdminSidebar />
      <main className="pl-64 pt-16">
        <div className="container mx-auto px-6 py-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  )
} 