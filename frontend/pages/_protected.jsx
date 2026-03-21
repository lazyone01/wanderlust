import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/store';

export default function ProtectedPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token || !savedUser) {
      router.push('/login');
    } else {
      try {
        const userData = JSON.parse(savedUser);
        useAuthStore.setState({ user: userData, token });
      } catch (error) {
        router.push('/login');
      }
    }
  }, [router]);

  return null;
}
