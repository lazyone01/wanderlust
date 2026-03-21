import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RoomCard } from '@/components/RoomCard';
import { roomAPI, roomServicesAPI } from '@/lib/api';
import { useAuthStore, useRoomStore } from '@/store/store';
import { Modal } from '@/components/Modal';
import { bookingAPI } from '@/lib/api';

export default function Rooms() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { rooms, setRooms, isLoading, setLoading, filters, setFilters } = useRoomStore();
  const [roomServices, setRoomServices] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isRoomServiceBooking, setIsRoomServiceBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    guestName: '',
    guestPhone: '',
    specialRequests: '',
  });

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.city]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms, roomServices, filters, citySearch]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = router.query.city ? { cityId: router.query.city } : {};
      
      // Fetch seeded rooms
      const response = await roomAPI.getAllRooms(params);
      console.log('✅ Seeded Rooms:', response.data.data);
      setRooms(response.data.data || []);
      
      // Fetch room services (approved ones) - PUBLIC ENDPOINT
      try {
        const servicesResponse = await roomServicesAPI.getApprovedRoomServices();
        console.log('✅ Room Services Response:', servicesResponse.data);
        console.log('✅ Approved Room Services Count:', servicesResponse.data.data?.length || 0);
        setRoomServices(servicesResponse.data.data || []);
      } catch (servicesError) {
        console.error('❌ Error fetching room services:', servicesError);
        console.error('Status:', servicesError.response?.status);
        console.error('Message:', servicesError.response?.data?.message);
        console.error('Full Error:', servicesError.message);
        setRoomServices([]);
      }
    } catch (error) {
      console.error('❌ Error fetching seeded rooms:', error);
      setRoomServices([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [];

    // Add seeded rooms
    filtered = filtered.concat(
      rooms
        .filter((room) => {
          const matchesCity = !citySearch || 
            (room.cityId?.name && room.cityId.name.toLowerCase().includes(citySearch.toLowerCase()));
          const matchesPrice = 
            room.price >= filters.minPrice && 
            room.price <= filters.maxPrice;
          return matchesCity && matchesPrice;
        })
        .map((room) => ({ ...room, type: 'seeded' }))
    );

    // Add room services
    filtered = filtered.concat(
      roomServices
        .filter((service) => {
          const matchesCity = !citySearch || 
            service.cityName.toLowerCase().includes(citySearch.toLowerCase());
          const matchesPrice = 
            service.pricePerNight >= filters.minPrice && 
            service.pricePerNight <= filters.maxPrice;
          return matchesCity && matchesPrice;
        })
        .map((service) => ({ ...service, type: 'service', _id: service._id, name: service.roomName, price: service.pricePerNight, capacity: service.capacity }))
    );

    setFilteredRooms(filtered);
  };

  const handleBookRoom = (room) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedRoom(room);
    setIsRoomServiceBooking(room.type === 'service');
    setShowBookingModal(true);
  };

  const handleSubmitBooking = async () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate || !bookingData.guestName || !bookingData.guestPhone) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await bookingAPI.createBooking({
        roomId: selectedRoom._id,
        ...bookingData,
        isRoomService: isRoomServiceBooking,
      });
      alert('✅ Booking created successfully! Check your email for confirmation.');
      setShowBookingModal(false);
      setSelectedRoom(null);
      setBookingData({
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        guestName: '',
        guestPhone: '',
        specialRequests: '',
      });
      setTimeout(() => router.push('/my-bookings'), 1000);
    } catch (error) {
      alert('Error creating booking: ' + error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">🏨 Browse Rooms</h1>
          <p className="text-blue-100">Find your perfect stay across India</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white shadow-soft">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* City Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🔍 Search City</label>
              <input
                type="text"
                placeholder="Enter city name..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="input-field w-full"
              />
            </div>
            
            {/* Min Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price (₹)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) || 0 })}
                className="input-field"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price (₹)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) || 50000 })}
                className="input-field"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCitySearch('');
                  setFilters({ minPrice: 0, maxPrice: 50000 });
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-600 mt-4">Loading rooms from all cities...</p>
              <p className="text-sm text-gray-500 mt-2">Fetching seeded rooms + user-submitted rooms</p>
            </div>
          ) : filteredRooms.length > 0 ? (
            <>
              <div className="mb-6 text-sm text-gray-600">
                <p className="font-semibold">
                  Found <span className="text-primary font-bold">{filteredRooms.length}</span> rooms matching your criteria
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredRooms.map((room) => (
                  <motion.div
                    key={`${room.type}-${room._id}`}
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    {room.type === 'service' ? (
                      // Room Service Card
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                        {/* Badge */}
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            ✨ New Listing
                          </span>
                        </div>
                        
                        {/* Image */}
                        <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={room.images?.[0] || 'https://via.placeholder.com/500x400?text=Room+Image'}
                            alt={room.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/500x400?text=Room+Image';
                            }}
                          />
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-800 truncate">{room.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">📍 {room.cityName}, {room.cityState}</p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-primary">₹{room.price}</span>
                            <span className="text-sm text-gray-600">per night</span>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-sm text-gray-700 line-clamp-2">{room.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">👥 {room.capacity} guests</span>
                            <span className="text-sm font-semibold text-green-600">Room verified ✓</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {room.amenities && room.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                {amenity}
                              </span>
                            ))}
                            {room.amenities && room.amenities.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                +{room.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleBookRoom(room)}
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                          >
                            Book Now ✈️
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Seeded Room Card
                      <div onClick={() => handleBookRoom(room)} className="cursor-pointer">
                        <RoomCard room={room} onBook={() => handleBookRoom(room)} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-2">No rooms found 😞</p>
              <p className="text-gray-500 mb-4">
                {citySearch || (filters.minPrice > 0 || filters.maxPrice < 50000)
                  ? 'Try adjusting your search filters or city name'
                  : 'Loading room services...'}
              </p>
              <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto text-left">
                <p className="text-sm text-blue-700 font-semibold mb-2">💡 Debugging Info:</p>
                <p className="text-xs text-blue-600">Total seeded rooms: {rooms.length}</p>
                <p className="text-xs text-blue-600">User-submitted rooms: {roomServices.length}</p>
                <p className="text-xs text-blue-600">Search term: {citySearch || '(none)'}</p>
                <p className="text-xs text-blue-600 mt-2">Open browser console (F12) for detailed logs</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        title={`Book ${selectedRoom?.name || 'Room'}`}
        onClose={() => setShowBookingModal(false)}
        size="lg"
      >
        <div className="space-y-4">
          {selectedRoom && (
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Room Type:</span> {isRoomServiceBooking ? '✨ New Listing' : 'Standard'}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Price per Night:</span> ₹{selectedRoom.price}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date *</label>
            <input
              type="date"
              value={bookingData.checkInDate}
              onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date *</label>
            <input
              type="date"
              value={bookingData.checkOutDate}
              onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Guests *</label>
            <select
              value={bookingData.numberOfGuests}
              onChange={(e) => setBookingData({ ...bookingData, numberOfGuests: parseInt(e.target.value) })}
              className="input-field"
            >
              {selectedRoom && Array.from({ length: selectedRoom.capacity }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} Guest{i + 1 > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Guest Name *</label>
            <input
              type="text"
              value={bookingData.guestName}
              onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })}
              className="input-field"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Guest Phone *</label>
            <input
              type="tel"
              value={bookingData.guestPhone}
              onChange={(e) => setBookingData({ ...bookingData, guestPhone: e.target.value })}
              className="input-field"
              placeholder="+91 XXXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests</label>
            <textarea
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
              className="input-field resize-none"
              rows="3"
              placeholder="Any special requests or preferences?"
            />
          </div>

          <button onClick={handleSubmitBooking} className="w-full btn-primary py-2">
            ✅ Confirm Booking
          </button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
