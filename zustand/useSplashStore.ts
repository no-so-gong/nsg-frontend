import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SplashState {
  isSplashShown: boolean;
  hasShownSplash: boolean;
  showSplash: () => void;
}

const useSplashStore = create<SplashState>()(
  persist(
    (set) => ({
      isSplashShown: false,
      hasShownSplash: false,
      showSplash: () => {
        set({ isSplashShown: true, hasShownSplash: true });
        // 최소 표시 시간을 보장
        setTimeout(() => {
          set((state) => ({ ...state, isSplashShown: false }));
        }, 2000);
      },
    }),
    {
      name: "splash-state",
      getStorage: () => AsyncStorage,
    }
  )
);

export default useSplashStore;
