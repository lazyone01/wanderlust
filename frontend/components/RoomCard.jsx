import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export const RoomCard = ({ room, onBook }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all card-hover"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.images?.[0] || 'https://via.placeholder.com/500x400'}
          alt={room.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
          ₹{room.price}/night
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{room.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description}</p>

        {/* Facilities */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Facilities:</p>
          <div className="flex flex-wrap gap-2">
            {room.facilities?.slice(0, 3).map((facility, idx) => (
              <span key={idx} className="text-xs bg-light text-primary px-2 py-1 rounded-full">
                ✓ {facility}
              </span>
            ))}
          </div>
        </div>

        {/* Rating & Capacity */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">★</span>
            <span className="text-gray-700 font-semibold">{room.rating?.toFixed(1) || 'N/A'}</span>
          </div>
          <div className="text-gray-600">👥 {room.capacity} persons</div>
        </div>

        {/* Contact */}
        <div className="text-xs text-gray-600 mb-4 border-b pb-4">
          📱 {room.contactPhone}
        </div>

        {/* Book Button */}
        <button
          onClick={() => onBook(room)}
          className="w-full btn-primary text-sm py-2"
        >
          Book Now
        </button>
      </div>
    </motion.div>
  );
};
