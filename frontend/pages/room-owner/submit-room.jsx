import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { roomServicesAPI } from '@/lib/api';

const amenitiesList = [
  'WiFi',
  'AC',
  'Parking',
  'Kitchen',
  'Hot Water',
  'Laundry',
  'TV',
  'Balcony',
  'Gym',
  'Swimming Pool',
  'CCTV',
  'Security Guard',
  'Lift',
  'Restaurant',
  'Housekeeping',
];

export default function SubmitRoom() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    cityName: '',
    cityState: '',
    roomName: '',
    description: '',
    capacity: 2,
    pricePerNight: '',
    roomPhone: '',
    images: ['', '', '', '', ''], // 5 image URL fields
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (
      !formData.ownerName ||
      !formData.ownerEmail ||
      !formData.ownerPhone ||
      !formData.cityName ||
      !formData.cityState ||
      !formData.roomName ||
      !formData.description ||
      !formData.pricePerNight ||
      !formData.roomPhone
    ) {
      setError('All fields are required');
      return;
    }

    if (formData.pricePerNight < 100 || formData.pricePerNight > 10000) {
      setError('Price must be between ₹100 and ₹10000 per night');
      return;
    }

    if (formData.capacity < 1 || formData.capacity > 10) {
      setError('Capacity must be between 1 and 10');
      return;
    }

    try {
      setLoading(true);

      const data = {
        ...formData,
        pricePerNight: parseInt(formData.pricePerNight),
        capacity: parseInt(formData.capacity),
        amenities: selectedAmenities,
        images: formData.images.filter((img) => img.trim() !== ''), // Remove empty URLs
      };

      const response = await roomServicesAPI.submitRoomService(data);

      setSuccess(
        'Room service submitted successfully! Our admin team will review and approve it soon.'
      );
      setFormData({
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        cityName: '',
        cityState: '',
        roomName: '',
        description: '',
        capacity: 2,
        pricePerNight: '',
        roomPhone: '',
        images: ['', '', '', '', ''],
      });
      setSelectedAmenities([]);

      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting room service');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-dark mb-2">List Your Room</h1>
          <p className="text-gray-600">
            Share your rooms with travelers across India on Wanderlust Rooms
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-700">
              {success} Redirecting to home...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Owner Information */}
            <div>
              <h3 className="text-xl font-bold text-dark mb-4">📋 Owner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            {/* City Information */}
            <div>
              <h3 className="text-xl font-bold text-dark mb-4">📍 City Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    City Name *
                  </label>
                  <input
                    type="text"
                    name="cityName"
                    value={formData.cityName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Pune, Bangalore"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="cityState"
                    value={formData.cityState}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Maharashtra, Karnataka"
                  />
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div>
              <h3 className="text-xl font-bold text-dark mb-4">🛏️ Room Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    name="roomName"
                    value={formData.roomName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Luxury Suite, Standard Room"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe your room in detail..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Capacity (Guests) *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Price per Night (₹) *
                    </label>
                    <input
                      type="number"
                      name="pricePerNight"
                      value={formData.pricePerNight}
                      onChange={handleInputChange}
                      min="100"
                      max="10000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Room Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="roomPhone"
                      value={formData.roomPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Room Images */}
            <div>
              <h3 className="text-xl font-bold text-dark mb-4">📸 Room Images (Optional)</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add up to 5 image URLs for your room. You can use Google Images URLs or any image hosting service.
                <br />
                <span className="text-xs text-blue-600 mt-1 inline-block">
                  💡 Tip: Search "room" on Google Images, right-click → Copy Image Link, paste here
                </span>
              </p>
              <div className="space-y-3">
                {formData.images.map((imageUrl, index) => (
                  <div key={index}>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Image URL {index + 1}
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`https://example.com/room-${index + 1}.jpg`}
                    />
                    {imageUrl && (
                      <div className="mt-2 rounded-lg overflow-hidden bg-gray-100 h-32">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+URL';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-bold text-dark mb-4">✨ Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-light transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="ml-2 text-sm text-dark">{amenity}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Select all amenities available in your room
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : '📤 Submit Room for Approval'}
            </motion.button>

            <p className="text-center text-sm text-gray-600 mt-4">
              ⏳ Your room will be reviewed by our admin team and you'll receive an email notification
              once approved.
            </p>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
