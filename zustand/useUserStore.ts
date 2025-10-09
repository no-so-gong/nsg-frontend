import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStore {
  userId: string | null;
  setUserId: (id: string) => Promise<void>;
  loadUserId: () => Promise<void>;
  clearUserId: () => Promise<void>;
}

const useUserStore = create<UserStore>((set) => ({
  userId: null,

  setUserId: async (id: string) => {
    if (id) {
      await AsyncStorage.setItem('userId', id);
      set({ userId: id });
    } else {
      // 빈 문자열이면 삭제
      await AsyncStorage.removeItem('userId');
      set({ userId: null });
    }
  },

  loadUserId: async () => {
    const stored = await AsyncStorage.getItem('userId');
    if (stored) {
      set({ userId: stored });
    }
  },

  clearUserId: async () => {
    await AsyncStorage.removeItem('userId');
    set({ userId: null });
  },
}));


export default useUserStore;