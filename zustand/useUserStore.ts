import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStore {
  userId: string | null;
  setUserId: (id: string) => Promise<void>;
  loadUserId: () => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  userId: null,

  setUserId: async (id: string) => {
    await AsyncStorage.setItem('userId', id);
    set({ userId: id });
  },

  loadUserId: async () => {
    const stored = await AsyncStorage.getItem('userId');
    if (stored) {
      set({ userId: stored });
    }
  },
}));


export default useUserStore;