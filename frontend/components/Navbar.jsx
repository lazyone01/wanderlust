import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/store';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-soft sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold gradient-text">🌍 Wanderlust</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition">
              Home
            </Link>
            <Link href="/rooms" className="text-gray-700 hover:text-primary transition">
              Rooms
            </Link>
            <Link href="/room-owner/submit-room" className="text-gray-700 hover:text-secondary transition font-semibold text-sm">
              🏠 List Your Room
            </Link>
            {user && (
              <>
                <Link href="/my-bookings" className="text-gray-700 hover:text-primary transition">
                  My Bookings
                </Link>
                <Link href="/complaints" className="text-gray-700 hover:text-primary transition">
                  Complaints
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link href="/admin/dashboard" className="text-primary hover:text-secondary transition font-semibold">
                      🔧 Admin
                    </Link>
                    <Link href="/admin/room-services" className="text-primary hover:text-secondary transition font-semibold">
                      🏠 Room Services
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">{user.firstName}</span>
                <button onClick={handleLogout} className="btn-outline text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary transition">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 border-t border-gray-200"
          >
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-light">
              Home
            </Link>
            <Link href="/rooms" className="block px-4 py-2 text-gray-700 hover:bg-light">
              Rooms
            </Link>
            <Link href="/room-owner/submit-room" className="block px-4 py-2 text-secondary font-semibold hover:bg-light">
              🏠 List Your Room
            </Link>
            {user && (
              <>
                <Link href="/my-bookings" className="block px-4 py-2 text-gray-700 hover:bg-light">
                  My Bookings
                </Link>
                <Link href="/complaints" className="block px-4 py-2 text-gray-700 hover:bg-light">
                  Complaints
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-primary font-semibold hover:bg-light">
                      🔧 Admin Dashboard
                    </Link>
                    <Link href="/admin/room-services" className="block px-4 py-2 text-primary font-semibold hover:bg-light">
                      🏠 Room Services Management
                    </Link>
                  </>
                )}
              </>
            )}
            {!user && (
              <>
                <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-light">
                  Login
                </Link>
                <Link href="/signup" className="block px-4 py-2 text-gray-700 hover:bg-light">
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
