export const animalImages: Record<number, { range: [number, number]; image: any }[]> = {
  1: [ // 시바견
    { range: [0, 9], image: require('@assets/images/shiba_image1.png') },
    { range: [10, 29], image: require('@assets/images/shiba_image2.png') },
    { range: [30, 49], image: require('@assets/images/shiba_image3.png') },
    { range: [50, 69], image: require('@assets/images/shiba_image4.png') },
    { range: [70, 89], image: require('@assets/images/shiba_image5.png') },
    { range: [90, 100], image: require('@assets/images/shiba_image6.png') },
  ],
  2: [ // 오리
    { range: [0, 9], image: require('@assets/images/duck_image1.png') },
    { range: [10, 29], image: require('@assets/images/duck_image2.png') },
    { range: [30, 49], image: require('@assets/images/duck_image3.png') },
    { range: [50, 69], image: require('@assets/images/duck_image4.png') },
    { range: [70, 89], image: require('@assets/images/duck_image5.png') },
    { range: [90, 100], image: require('@assets/images/duck_image6.png') },
  ],
  3: [ // 병아리
    { range: [0, 9], image: require('@assets/images/chick_image1.png') },
    { range: [10, 29], image: require('@assets/images/chick_image2.png') },
    { range: [30, 49], image: require('@assets/images/chick_image3.png') },
    { range: [50, 69], image: require('@assets/images/chick_image4.png') },
    { range: [70, 89], image: require('@assets/images/chick_image5.png') },
    { range: [90, 100], image: require('@assets/images/chick_image6.png') },
  ],
};


export const getAnimalImageByEmotion = (animalId: number, emotion: number) => {
  const images = animalImages[animalId];
  if (!images) return null;

  const found = images.find(img => emotion >= img.range[0] && emotion <= img.range[1]);
  return found ? found.image : images[0].image;
};

export const getAnimalImageByEvolutionStage = (animalId: number, evolutionStage: number) => {
  const images = animalImages[animalId];
  if (!images) return null;
  
  const clampedStage = Math.max(1, Math.min(6, evolutionStage));
  return images[clampedStage - 1]?.image || images[0].image;
};
