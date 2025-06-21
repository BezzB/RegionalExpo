import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProgramsOpen, setIsProgramsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Contact', path: '/contact' },
    { label: 'Sponsorship', path: '/sponsorship' },
    { label: 'Gallery', path: '/gallery' }
  ]

  const programItems = [
    { label: 'First Lady Marathon', path: '/programs/marathon' },
    { label: 'Gala Breakfast', path: '/programs/gala' }
  ]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 bg-white shadow-lg`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/assets/images/MITECH-01-01.png" 
              alt="Regional Climate Expo Logo" 
              className="h-10 w-auto mr-2"
            />
            <motion.span 
              className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Regional Climate Expo
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative group"
              >
                <span className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-green-800'
                    : 'text-gray-600 group-hover:text-green-800'
                }`}>
                  {item.label}
                </span>
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-green-800 transform origin-left transition-transform duration-300 ${
                  isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}

            {/* Programs Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/programs')
                    ? 'text-green-800'
                    : 'text-gray-600 hover:text-green-800'
                }`}
              >
                <span>Programs</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isProgramsOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {isProgramsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    {programItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-4 py-2 text-sm ${
                          isActive(item.path)
                            ? 'text-green-800 bg-green-50'
                            : 'text-gray-600 hover:bg-green-50 hover:text-green-800'
                        }`}
                        onClick={() => setIsProgramsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Get Involved Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/sponsorship"
                className="bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-2.5 rounded-full
                  hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300
                  font-medium text-sm"
              >
                Get Involved
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-600 hover:text-green-800 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute block h-0.5 w-6 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45 translate-y-0 bg-green-800' : '-translate-y-2 bg-current'
                }`}
              />
              <span
                className={`absolute block h-0.5 w-6 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'opacity-0 translate-x-3' : 'bg-current'
                }`}
              />
              <span
                className={`absolute block h-0.5 w-6 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45 translate-y-0 bg-green-800' : 'translate-y-2 bg-current'
                }`}
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white/90 backdrop-blur-md rounded-2xl mt-2 shadow-xl"
            >
              <div className="flex flex-col space-y-1 p-4">
                {navItems.map((item) => (
                  <motion.div
                    key={item.path}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={item.path}
                      className={`block px-4 py-3 rounded-xl transition-colors duration-200 ${
                        isActive(item.path)
                          ? 'bg-green-800 text-white'
                          : 'text-gray-600 hover:bg-green-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Programs Section */}
                <div className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-600 mb-2">Programs</div>
                  <div className="space-y-1">
                    {programItems.map((item) => (
                      <motion.div
                        key={item.path}
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to={item.path}
                          className={`block px-4 py-2 rounded-xl transition-colors duration-200 ${
                            isActive(item.path)
                              ? 'bg-green-800 text-white'
                              : 'text-gray-600 hover:bg-green-50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Mobile Get Involved Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 pt-2"
                >
                  <Link
                    to="/sponsorship"
                    className="block bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-3
                      rounded-xl text-center font-medium hover:shadow-lg transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Involved
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
} 