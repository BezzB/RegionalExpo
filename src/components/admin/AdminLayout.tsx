import { ReactNode, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

interface AdminLayoutProps {
  children?: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset focus and scroll position on route change
    document.body.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.body.style.scrollBehavior = '';
    
    // Focus on main content for accessibility
    const mainContent = document.getElementById('admin-main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.removeAttribute('tabindex');
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <AdminSidebar />
      <main 
        id="admin-main-content"
        tabIndex={-1}
        className="pl-64 pt-16"
      >
        <div className="container mx-auto px-6 py-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  )
} 