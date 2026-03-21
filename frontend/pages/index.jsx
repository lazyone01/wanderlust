import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { roomAPI, bookingAPI } from '@/lib/api';
import { useAuthStore, useRoomStore } from '@/store/store';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { cities, setCities, isLoading, setLoading } = useRoomStore();
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchDates, setSearchDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.getCities();
      setCities(response.data.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!selectedCity || !searchDates.checkIn || !searchDates.checkOut) {
      alert('Please fill all fields');
      return;
    }
    router.push(
      `/rooms?city=${selectedCity}&checkIn=${searchDates.checkIn}&checkOut=${searchDates.checkOut}`
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Explore India's Best Budget Rooms</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover comfortable, affordable, and verified rooms across 15 major tourist destinations in India
          </p>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-soft rounded-2xl mx-4 sm:mx-6 lg:mx-8 -mt-10 relative z-10 max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">Find Your Perfect Room</h2>

          {/* City Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">Select City</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-60 overflow-y-auto">
              {cities.map((city) => (
                <motion.button
                  key={city._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCity(city._id)}
                  className={`p-3 rounded-lg font-semibold transition-all ${
                    selectedCity === city._id
                      ? 'bg-primary text-white shadow-medium'
                      : 'bg-light text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {city.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Date & Guests Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date</label>
              <input
                type="date"
                value={searchDates.checkIn}
                onChange={(e) => setSearchDates({ ...searchDates, checkIn: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date</label>
              <input
                type="date"
                value={searchDates.checkOut}
                onChange={(e) => setSearchDates({ ...searchDates, checkOut: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Guests</label>
              <select
                value={searchDates.guests}
                onChange={(e) => setSearchDates({ ...searchDates, guests: parseInt(e.target.value) })}
                className="input-field"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            className="w-full btn-primary py-3 text-lg"
          >
            Search Rooms →
          </motion.button>
        </motion.div>
      </section>

      {/* Featured Cities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            Featured Destinations
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {cities.slice(0, 6).map((city) => (
              <motion.div
                key={city._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="relative h-48 rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition cursor-pointer group"
                onClick={() => router.push(`/rooms?city=${city._id}`)}
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black group-hover:opacity-20 opacity-10 transition-opacity" />
                  <div className="relative z-10 text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                    <p className="text-sm text-blue-100">{city.roomCount} rooms</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/rooms" className="btn-primary inline-block">
              View All Destinations →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-light">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-12"
          >
            Why Choose Wanderlust Rooms?
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: '✓', title: 'Verified Facilities', desc: 'All rooms are verified for quality' },
              { icon: '💰', title: 'Best Prices', desc: '₹500 - ₹2500 per night' },
              { icon: '🔒', title: 'Full Security', desc: '24/7 security & privacy' },
              { icon: '📱', title: 'Easy Booking', desc: 'Book in just a few clicks' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-soft text-center hover:shadow-medium transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
