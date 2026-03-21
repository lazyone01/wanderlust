import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-2">🌍 Wanderlust Rooms</h3>
            <p className="text-gray-400">
              Budget tourist rooms across India with transparent pricing and verified facilities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-primary transition">
                  Browse Rooms
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <div className="text-gray-400 space-y-2">
              <p>📧 jayjaiswal655@gmail.com</p>
              <p>📱 9771147497</p>
              <p>🌐 www.wanderlustrooms.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">
            © 2026 Wanderlust Rooms. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
