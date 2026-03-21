import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { complaintAPI } from '@/lib/api';
import { useAuthStore } from '@/store/store';
import { Modal } from '@/components/Modal';

export default function Complaints() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const response = await complaintAPI.getUserComplaints();
      setComplaints(response.data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await complaintAPI.createComplaint(formData);
      alert('Complaint submitted successfully');
      setFormData({ title: '', description: '', category: 'other', priority: 'medium' });
      setShowModal(false);
      fetchComplaints();
    } catch (error) {
      alert('Error submitting complaint');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold gradient-text">
              Complaints & Support
            </motion.h1>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Raise Complaint
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading complaints...</p>
          ) : complaints.length > 0 ? (
            <motion.div className="space-y-4">
              {complaints.map((complaint) => (
                <motion.div
                  key={complaint._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{complaint.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        complaint.status === 'resolved'
                          ? 'bg-green-100 text-green-700'
                          : complaint.status === 'open'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {complaint.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{complaint.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-semibold capitalize">{complaint.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Priority</p>
                      <p className={`font-semibold capitalize ${
                        complaint.priority === 'critical' ? 'text-red-600' : 'text-yellow-600'
                      }`}>{complaint.priority}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-semibold">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-semibold">ID: {complaint._id.slice(-6)}</p>
                    </div>
                  </div>

                  {complaint.adminNotes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                      <p className="text-sm font-semibold text-blue-900">Admin Response:</p>
                      <p className="text-sm text-blue-800 mt-1">{complaint.adminNotes}</p>
                    </div>
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
              <p className="text-gray-600 text-lg">No complaints yet</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Complaint Modal */}
      <Modal
        isOpen={showModal}
        title="Raise a Complaint"
        onClose={() => setShowModal(false)}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="Brief title..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field resize-none"
              rows="4"
              placeholder="Detailed description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option value="cleanliness">Cleanliness</option>
                <option value="facilities">Facilities</option>
                <option value="service">Service</option>
                <option value="noise">Noise</option>
                <option value="security">Security</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <button onClick={handleSubmitComplaint} className="w-full btn-primary py-2">
            Submit Complaint
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
