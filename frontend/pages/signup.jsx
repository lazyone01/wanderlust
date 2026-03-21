import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/store';

export default function Signup() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [step, setStep] = useState('email'); // email, otp, signup
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    firstName: '',
    lastName: '',
    otp: '',
  });

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter email');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await authAPI.sendOTP(email);
      setFormData({ ...formData, email });
      setStep('otp');
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (!otp) {
      setError('Please enter OTP');
      return;
    }
    setFormData({ ...formData, otp });
    setStep('signup');
  };

  const handleSignup = async () => {
    if (!formData.phone || !formData.password || !formData.firstName || !formData.lastName) {
      setError('All fields are required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await authAPI.signup(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setToken(response.data.token);
      router.push('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />

      <div className="max-w-md mx-auto py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-medium p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-2 gradient-text">Wanderlust Rooms</h1>
          <p className="text-center text-gray-600 mb-8">Create your account</p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}

          {step === 'email' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full btn-primary py-3"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <p className="text-center text-gray-600 text-sm">
                Enter the OTP sent to <strong>{formData.email}</strong>
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">OTP *</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                />
                <p className="text-xs text-gray-500 mt-2">Check your terminal for the OTP</p>
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full btn-primary py-3"
              >
                Verify OTP
              </button>
            </motion.div>
          )}

          {step === 'signup' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full btn-primary py-3"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
