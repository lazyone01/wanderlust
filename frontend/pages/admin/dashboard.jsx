import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { bookingAPI, complaintAPI } from '@/lib/api';
import { useAuthStore } from '@/store/store';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalComplaints: 0,
    openComplaints: 0,
  });

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, complaintsRes] = await Promise.all([
        bookingAPI.getAllBookings(),
        complaintAPI.getAllComplaints(),
      ]);

      const bookingsList = bookingsRes.data?.data || [];
      const complaintsList = complaintsRes.data?.data || [];

      setBookings(bookingsList);
      setComplaints(complaintsList);

      // Calculate stats
      const pending = bookingsList?.filter((b) => b.status === 'pending').length || 0;
      const open = complaintsList?.filter((c) => c.status === 'open').length || 0;

      setStats({
        totalBookings: bookingsList?.length || 0,
        pendingBookings: pending,
        totalComplaints: complaintsList?.length || 0,
        openComplaints: open,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Bookings error:', error.response?.data);
      alert('Failed to load admin data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-dark mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings and complaints</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary"
          >
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalBookings}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500"
          >
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending Bookings</h3>
            <p className="text-3xl font-bold text-orange-500">{stats.pendingBookings}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-secondary"
          >
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Complaints</h3>
            <p className="text-3xl font-bold text-secondary">{stats.totalComplaints}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500"
          >
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Open Complaints</h3>
            <p className="text-3xl font-bold text-red-500">{stats.openComplaints}</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2 px-4 font-semibold transition ${
              activeTab === 'bookings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            📅 Bookings ({stats.totalBookings})
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`py-2 px-4 font-semibold transition ${
              activeTab === 'complaints'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            📝 Complaints ({stats.totalComplaints})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {bookings.length === 0 ? (
                  <div className="bg-white p-8 rounded-lg text-center">
                    <p className="text-gray-600">No bookings yet</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-light border-b">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Guest</th>
                          <th className="px-6 py-4 text-left font-semibold">Room</th>
                          <th className="px-6 py-4 text-left font-semibold">City</th>
                          <th className="px-6 py-4 text-left font-semibold">Check-In</th>
                          <th className="px-6 py-4 text-left font-semibold">Check-Out</th>
                          <th className="px-6 py-4 text-left font-semibold">Price</th>
                          <th className="px-6 py-4 text-left font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr
                            key={booking._id}
                            className="border-b hover:bg-light transition"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-semibold text-dark">
                                  {booking.guestName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {booking.guestPhone}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-dark">{booking.roomId?.name || 'N/A'}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-dark">{booking.cityId?.name || 'N/A'}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(booking.checkInDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(booking.checkOutDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 font-semibold text-primary">
                              ₹{booking.totalPrice}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : booking.status === 'cancelled'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* Complaints Tab */}
            {activeTab === 'complaints' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {complaints.length === 0 ? (
                  <div className="bg-white p-8 rounded-lg text-center">
                    <p className="text-gray-600">No complaints yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <motion.div
                        key={complaint._id}
                        whileHover={{ y: -2 }}
                        className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Title</p>
                            <p className="font-semibold text-dark">{complaint.title}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Category</p>
                            <p className="font-semibold text-dark capitalize">
                              {complaint.category}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Priority</p>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                                complaint.priority === 'critical'
                                  ? 'bg-red-100 text-red-700'
                                  : complaint.priority === 'high'
                                  ? 'bg-orange-100 text-orange-700'
                                  : complaint.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {complaint.priority}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{complaint.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                                complaint.status === 'resolved'
                                  ? 'bg-green-100 text-green-700'
                                  : complaint.status === 'in-progress'
                                  ? 'bg-blue-100 text-blue-700'
                                  : complaint.status === 'open'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {complaint.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Admin Notes</p>
                            <p className="text-dark">
                              {complaint.adminNotes || 'No notes yet'}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Submitted: {new Date(complaint.createdAt).toLocaleString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
