import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { bookingAPI } from '@/lib/api';
import { useAuthStore } from '@/store/store';

export default function MyBookings() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      alert('Error cancelling booking');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold mb-8 gradient-text">
            My Bookings
          </motion.h1>

          {loading ? (
            <p className="text-center text-gray-600">Loading bookings...</p>
          ) : bookings.length > 0 ? (
            <motion.div className="space-y-4">
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Room</p>
                      <p className="font-bold text-lg">{booking.roomId.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Check-in</p>
                      <p className="font-semibold">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Check-out</p>
                      <p className="font-semibold">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Guests</p>
                      <p className="font-semibold">{booking.numberOfGuests}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Price</p>
                      <p className="font-bold text-primary">₹{booking.totalPrice}</p>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="btn-outline text-sm py-2"
                    >
                      Cancel Booking
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-lg shadow-soft"
            >
              <p className="text-gray-600 text-lg mb-4">No bookings yet</p>
              <Link href="/rooms" className="btn-primary inline-block">
                Book a Room →
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
