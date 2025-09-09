import { create } from 'zustand';

interface PetStore {
  currentPetImage: any | null;
  currentPetId: number | null;
  currentPetEvolutionStage: number | null;
  setCurrentPetImage: (img: any) => void;
  setCurrentPetId: (id: number) => void;
  setCurrentPetEvolutionStage: (stage: number) => void;
}

const usePetStore = create<PetStore>((set) => ({
  currentPetImage: null,
  currentPetId: null,
  currentPetEvolutionStage: null,
  setCurrentPetImage: (img) => set({ currentPetImage: img }),
  setCurrentPetId: (id) => set({ currentPetId: id }),
  setCurrentPetEvolutionStage: (stage) => set({ currentPetEvolutionStage: stage }),
}));

export default usePetStore;
