import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => set({ user: null, token: null }),
}));

export const useBookingStore = create((set) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,

  setBookings: (bookings) => set({ bookings }),
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  setLoading: (isLoading) => set({ isLoading }),

  addBooking: (booking) =>
    set((state) => ({
      bookings: [...state.bookings, booking],
    })),
}));

export const useRoomStore = create((set) => ({
  rooms: [],
  cities: [],
  selectedCity: null,
  filters: {
    minPrice: 500,
    maxPrice: 2500,
    facilities: [],
  },
  isLoading: false,

  setRooms: (rooms) => set({ rooms }),
  setCities: (cities) => set({ cities }),
  setSelectedCity: (city) => set({ selectedCity: city }),
  setFilters: (filters) => set({ filters }),
  setLoading: (isLoading) => set({ isLoading }),
}));
