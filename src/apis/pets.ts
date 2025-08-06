import axios from 'axios';
import { API_URL } from '@config/config';
import { PET_BASE } from '@/constants/endpoints';

interface RegisterResponse {
  message: string;
  data: {
    shiba: string;
    chick: string;
    duck: string;
  };
  status: number;
}

export const registerNames = async ({
  userId,
  animals,
}: {
  userId: string;
  animals: { animalId: number; name: string }[];
}): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${API_URL}${PET_BASE}/nickname`,
      { animals },
      {
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('동물 등록 실패: 알 수 없는 에러');
    }
  }
};
