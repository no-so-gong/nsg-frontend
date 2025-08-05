import axios from 'axios';
import { API_URL } from '@config/config';
import { USER_BASE } from '@/constants/endpoints';

interface UserPropertyResponse {
  money: number;
  message: string;
  status: number;
}

export const createUser = async () => {
  try {
    const response = await axios.post(`${API_URL}${USER_BASE}/start`);

    if (!response.data?.userId) {
      throw new Error('응답에 userId가 없습니다.');
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('유저 생성 실패: 알 수 없는 에러');
    }
  }
};

export const getUserProperty = async (userId: string): Promise<UserPropertyResponse> => {
  try {
    const response = await axios.get<UserPropertyResponse>(
      `${API_URL}${USER_BASE}/property`,
      {
        headers: {
          'user-id': userId,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('보유 골드 조회 실패: 알 수 없는 에러');
    }
  }
};