import { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GalleryProvider } from './context/GalleryContext'
import Layout from './components/Layout'
import supabase from './lib/supabase'
import AdminLayout from './components/admin/AdminLayout'

// Create a client
const queryClient = new QueryClient()

// Lazy load pages
const Home = lazy(() => import('./routes/Home'))
const About = lazy(() => import('./routes/About'))
const Contact = lazy(() => import('./routes/Contact'))
const Gallery = lazy(() => import('./routes/Gallery'))
const Programs = lazy(() => import('./routes/Programs'))
const Sponsorship = lazy(() => import('./routes/Sponsorship'))
const Sponsors = lazy(() => import('./routes/Sponsors'))
const Events = lazy(() => import('./routes/Events'))
const FirstLadyMarathon = lazy(() => import('./routes/FirstLadyMarathon'))
const GalaBreakfast = lazy(() => import('./routes/GalaBreakfast'))
const AdminDashboard = lazy(() => import('./routes/admin/AdminDashboard'))
const AdminLogin = lazy(() => import('./routes/admin/Login'))
const AdminGallery = lazy(() => import('./routes/admin/Gallery'))
const AdminEvents = lazy(() => import('./routes/admin/Events'))
const AdminSpeakers = lazy(() => import('./routes/admin/Speakers'))
const AdminSponsors = lazy(() => import('./routes/admin/Sponsors'))
const AdminPartners = lazy(() => import('./routes/admin/Partners'))
const AdminExhibitors = lazy(() => import('./routes/admin/Exhibitors'))
const AdminAttendees = lazy(() => import('./routes/admin/Attendees'))
const AdminPayments = lazy(() => import('./routes/admin/Payments'))
const AdminSettings = lazy(() => import('./routes/admin/Settings'))
const AdminNotifications = lazy(() => import('./routes/admin/Notifications'))

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "gallery",
        element: <Gallery />
      },
      {
        path: "programs",
        element: <Programs />
      },
      {
        path: "program",
        element: <Events />
      },
      {
        path: "sponsorship",
        element: <Sponsorship />
      },
      {
        path: "sponsors",
        element: <Sponsors />
      },
      {
        path: "events",
        element: <Events />
      },
      {
        path: "first-lady-marathon",
        element: <FirstLadyMarathon />
      },
      {
        path: "breakfast",
        element: <GalaBreakfast />
      },
      {
        path: "programs/gala",
        element: <GalaBreakfast />
      },
      {
        path: "programs/marathon",
        element: <FirstLadyMarathon />
      }
    ]
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/admin",
    element: (
      <GalleryProvider>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </GalleryProvider>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />
      },
      {
        path: "gallery",
        element: <AdminGallery />
      },
      {
        path: "events",
        element: <AdminEvents />
      },
      {
        path: "speakers",
        element: <AdminSpeakers />
      },
      {
        path: "sponsors",
        element: <AdminSponsors />
      },
      {
        path: "partners",
        element: <AdminPartners />
      },
      {
        path: "exhibitors",
        element: <AdminExhibitors />
      },
      {
        path: "attendees",
        element: <AdminAttendees />
      },
      {
        path: "payments",
        element: <AdminPayments />
      },
      {
        path: "settings",
        element: <AdminSettings />
      },
      {
        path: "notifications",
        element: <AdminNotifications />
      }
    ]
  }
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </Suspense>
    </QueryClientProvider>
  )
}

export default App 