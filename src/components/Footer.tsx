"use client";

import { Link } from 'react-router-dom';

const socialLinks = [
  { name: 'Twitter', icon: '𝕏', href: '#' },
  { name: 'Facebook', icon: 'f', href: '#' },
  { name: 'Instagram', icon: '📸', href: '#' },
  { name: 'LinkedIn', icon: 'in', href: '#' }
];

const footerLinks = {
  'Quick Links': [
    { name: 'About Us', href: '/about' },
    { name: 'Program', href: '/program' },
    { name: 'Speakers', href: '/speakers' },
    { name: 'Sponsors', href: '/sponsors' }
  ],
  'Resources': [
    { name: 'Press Kit', href: '/press' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' }
  ],
  'Contact': [
    { name: 'info@regionalexpo.com', href: 'mailto:info@regionalexpo.com' },
    { name: '+254 724 556401', href: 'tel:+254 724 556401' },
    { name: 'MMUST, Kakamega', href: '#' }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white/80">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-bold text-white">Regional Climate Expo</h3>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Join us in shaping East Africa's climate future through innovation, 
              collaboration, and sustainable practices.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                    hover:bg-white/20 transition-colors duration-300"
                  aria-label={social.name}
                >
                  <span className="text-sm font-semibold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-lg font-semibold text-white">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-white/60 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        </div>

      {/* Newsletter Section */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Subscribe to Our Newsletter
              </h4>
              <p className="text-sm text-white/60">
                Stay updated with the latest news and announcements
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                  focus:outline-none focus:border-white/40 text-white placeholder:text-white/40
                  min-w-[240px]"
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-white text-gray-900 font-semibold
                  hover:bg-white/90 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <p>© 2025 Regional Climate Expo. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 