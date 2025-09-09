import { create } from 'zustand';

interface PetStore {
  currentPetImage: any | null;
  currentPetId: number | null;
  setCurrentPetImage: (img: any) => void;
  setCurrentPetId: (id: number) => void;
}

const usePetStore = create<PetStore>((set) => ({
  currentPetImage: null,
  currentPetId: null,
  setCurrentPetImage: (img) => set({ currentPetImage: img }),
  setCurrentPetId: (id) => set({ currentPetId: id }),
}));

export default usePetStore;
