import { create } from 'zustand';
import { PetInfo } from '@/apis/pets'

interface PetStore {
  currentPetImage: any | null;
  currentPetId: number | null;
  currentPetEvolutionStage: number | null;
  setCurrentPetImage: (img: any) => void;
  setCurrentPetId: (id: number) => void;
  setCurrentPetEvolutionStage: (stage: number) => void;

  // 모든 펫의 상세 정보를 담는 객체 (key: animalId)
  petsInfo: {
    [key: number]: PetInfo | null;
  };

  // 단일 펫의 정보를 업데이트하거나 추가하는 액션
  setPetInfo: (petInfo: PetInfo) => void;

  // 여러 펫의 정보를 한 번에 초기화하는 액션
  initializePets: (allPetsInfo: PetInfo[]) => void;
}

const usePetStore = create<PetStore>((set) => ({
  currentPetImage: null,
  currentPetId: null,
  currentPetEvolutionStage: null,

  petsInfo: {},

  setCurrentPetId: (id) => set({ currentPetId: id }),
  setCurrentPetEvolutionStage: (stage) => set({ currentPetEvolutionStage: stage }),
  setCurrentPetImage: (image) => set({ currentPetImage: image }),

  setPetInfo: (petInfo) => {
    set((state) => ({
      // 기존 petsInfo 상태를 복사한 후,
      // animalId를 키로 사용하여 새로운 펫 정보를 덮어씁니다.
      petsInfo: {
        ...state.petsInfo,
        [petInfo.animalId]: petInfo,
      },
    }));
  },

  initializePets: (allPetsInfo) => {
    // API로부터 받은 펫 정보 배열을 { 1: PetInfo, 2: PetInfo, ... } 형태의 객체로 변환
    const infoMap = allPetsInfo.reduce((acc, pet) => {
      acc[pet.animalId] = pet;
      return acc;
    }, {} as { [key: number]: PetInfo });

    set({ petsInfo: infoMap });
  },
}));

export default usePetStore;
