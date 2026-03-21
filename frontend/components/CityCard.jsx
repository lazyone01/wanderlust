import React from 'react';
import { motion } from 'framer-motion';

export const CityCard = ({ city, isSelected, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={`relative rounded-lg overflow-hidden cursor-pointer h-48 card-hover ${
        isSelected ? 'ring-4 ring-primary' : ''
      }`}
    >
      {/* Background Image */}
      <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-100 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-black opacity-20 hover:opacity-10 transition-opacity" />

        {/* Content */}
        <div className="relative z-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
          <p className="text-sm text-gray-100 mb-2">{city.state}</p>
          <p className="text-xs text-gray-200">{city.roomCount} rooms available</p>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold"
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
};
