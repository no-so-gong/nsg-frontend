import { create } from 'zustand';

interface PetStore {
  currentPetImage: any | null;
  setCurrentPetImage: (img: any) => void;
}

const usePetStore = create<PetStore>((set) => ({
  currentPetImage: null,
  setCurrentPetImage: (img) => set({ currentPetImage: img }),
}));

export default usePetStore;
