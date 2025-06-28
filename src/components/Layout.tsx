import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { Toaster } from './ui/toaster'

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset focus and scroll position on route change
    document.body.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.body.style.scrollBehavior = '';
    
    // Focus on main content for accessibility
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.removeAttribute('tabindex');
    }
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main 
        id="main-content"
        tabIndex={-1}
        className="flex-1 pt-24"
      >
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  )
} 