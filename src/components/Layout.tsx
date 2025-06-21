import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { GalleryProvider } from '../context/GalleryContext'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 pt-24">
        <GalleryProvider>
          <Outlet />
        </GalleryProvider>
      </main>
      <Footer />
    </div>
  )
} 