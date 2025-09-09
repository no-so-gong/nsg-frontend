// 동물별 이미지 배열 - 모든 미니게임에서 공통 사용
export const ANIMAL_IMAGES = {
  1: [ // 시바견
    require('@assets/images/shiba_image1.png'),
    require('@assets/images/shiba_image2.png'),
    require('@assets/images/shiba_image3.png'),
    require('@assets/images/shiba_image4.png'),
    require('@assets/images/shiba_image5.png'),
    require('@assets/images/shiba_image6.png'),
  ],
  2: [ // 오리
    require('@assets/images/duck_image1.png'),
    require('@assets/images/duck_image2.png'),
    require('@assets/images/duck_image3.png'),
    require('@assets/images/duck_image4.png'),
    require('@assets/images/duck_image5.png'),
    require('@assets/images/duck_image6.png'),
  ],
  3: [ // 병아리
    require('@assets/images/chick_image1.png'),
    require('@assets/images/chick_image2.png'),
    require('@assets/images/chick_image3.png'),
    require('@assets/images/chick_image4.png'),
    require('@assets/images/chick_image5.png'),
    require('@assets/images/chick_image6.png'),
  ],
};

// 현재 동물에 해당하는 이미지 배열을 반환하는 헬퍼 함수
export const getAnimalImages = (currentAnimal: number) => {
  return ANIMAL_IMAGES[currentAnimal as keyof typeof ANIMAL_IMAGES] || ANIMAL_IMAGES[2]; // 기본값: 오리
};

// 특정 동물의 특정 인덱스 이미지를 반환하는 헬퍼 함수
export const getAnimalImage = (currentAnimal: number, imageIndex: number = 0) => {
  const images = getAnimalImages(currentAnimal);
  return images[imageIndex] || images[0]; // 기본값: 첫 번째 이미지
};