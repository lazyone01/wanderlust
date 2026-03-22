import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuthStore } from '@/store/store';
import axios from 'axios';

export default function RoomServicesAdmin() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [roomServices, setRoomServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [approvalForm, setApprovalForm] = useState({ adminNotes: '' });
  const [rejectionForm, setRejectionForm] = useState({ reason: '' });
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    fetchRoomServices();
  }, [filterStatus]);

  const fetchRoomServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/room-services/pending/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setRoomServices(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching room services:', error);
      alert('Failed to load room services');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRoom) return;

    try {
      setActionLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/room-services/${selectedRoom._id}/approve`,
        approvalForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('✅ Room service approved successfully!');
      setShowApprovalModal(false);
      setSelectedRoom(null);
      setApprovalForm({ adminNotes: '' });
      fetchRoomServices();
    } catch (error) {
      console.error('Error approving room service:', error);
      alert('Failed to approve room service');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRoom || !rejectionForm.reason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/room-services/${selectedRoom._id}/reject`,
        rejectionForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert('❌ Room service rejected successfully!');
      setShowRejectionModal(false);
      setSelectedRoom(null);
      setRejectionForm({ reason: '' });
      fetchRoomServices();
    } catch (error) {
      console.error('Error rejecting room service:', error);
      alert('Failed to reject room service');
    } finally {
      setActionLoading(false);
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
          <h1 className="text-4xl font-bold text-dark mb-2">🏠 Room Services Approval</h1>
          <p className="text-gray-600">Verify and approve new room listings from owners</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500"
          >
            <h3 className="text-gray-600 text-sm font-semibold mb-2">📋 Pending</h3>
            <p className="text-3xl font-bold text-orange-500">
              {roomServices.filter((r) => r.status === 'pending').length}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500"
          >
            <h3 className="text-gray-600 text-sm font-semibold mb-2">✅ Approved</h3>
            <p className="text-3xl font-bold text-green-500">
              {roomServices.filter((r) => r.status === 'approved').length}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500"
          >
            <h3 className="text-gray-600 text-sm font-semibold mb-2">❌ Rejected</h3>
            <p className="text-3xl font-bold text-red-500">
              {roomServices.filter((r) => r.status === 'rejected').length}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary"
          >
            <h3 className="text-gray-600 text-sm font-semibold mb-2">🏘️ Total</h3>
            <p className="text-3xl font-bold text-primary">{roomServices.length}</p>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`py-2 px-4 font-semibold transition capitalize ${
                filterStatus === status
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              {status === 'pending' && '📋'}
              {status === 'approved' && '✅'}
              {status === 'rejected' && '❌'}
              {' '}
              {status}
            </button>
          ))}
        </div>

        {/* Room Services List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading room services...</p>
          </div>
        ) : roomServices.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-gray-600">No {filterStatus} room services</p>
          </div>
        ) : (
          <div className="space-y-4">
            {roomServices.map((service) => (
              <motion.div
                key={service._id}
                whileHover={{ y: -2 }}
                className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary hover:shadow-md transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Owner</p>
                    <p className="font-bold text-dark">{service.ownerName}</p>
                    <p className="text-sm text-gray-600">{service.ownerEmail}</p>
                    <p className="text-sm text-gray-600">📱 {service.ownerPhone}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Room Details</p>
                    <p className="font-bold text-dark">{service.roomName}</p>
                    <p className="text-sm text-gray-600">
                      📍 {service.cityName}, {service.cityState}
                    </p>
                    <p className="text-sm text-gray-600">👥 Capacity: {service.capacity}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Pricing & Amenities</p>
                    <p className="font-bold text-primary">₹{service.pricePerNight}/night</p>
                    <p className="text-sm text-gray-600">
                      ✨ {service.amenities?.length || 0} amenities
                    </p>
                    <p className="text-sm text-gray-600">📞 {service.roomPhone}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                        service.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : service.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {service.status.toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-600 mt-2">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4 p-4 bg-light rounded">
                  <p className="text-sm text-dark">{service.description}</p>
                </div>

                {/* Amenities */}
                {service.amenities?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {service.adminNotes && (
                  <div className="mb-4 p-3 bg-gray-100 rounded border-l-4 border-gray-400">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Admin Notes:</p>
                    <p className="text-sm text-gray-700">{service.adminNotes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {service.status === 'pending' && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedRoom(service);
                        setShowApprovalModal(true);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition"
                    >
                      ✅ Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedRoom(service);
                        setShowRejectionModal(true);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition"
                    >
                      ❌ Reject
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-dark mb-4">
              ✅ Approve Room Service?
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedRoom.roomName} in {selectedRoom.cityName} will be listed on the platform
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={approvalForm.adminNotes}
                onChange={(e) =>
                  setApprovalForm({ ...approvalForm, adminNotes: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add any notes for the owner..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedRoom(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded font-semibold text-dark hover:bg-light transition"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition disabled:opacity-50"
              >
                {actionLoading ? 'Approving...' : '✅ Approve'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-dark mb-4">
              ❌ Reject Room Service?
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedRoom.roomName} in {selectedRoom.cityName}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-dark mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionForm.reason}
                onChange={(e) =>
                  setRejectionForm({ ...rejectionForm, reason: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Explain why this room service is being rejected..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setSelectedRoom(null);
                  setRejectionForm({ reason: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded font-semibold text-dark hover:bg-light transition"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReject}
                disabled={actionLoading || !rejectionForm.reason.trim()}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : '❌ Reject'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
