import axios from 'axios';
import { API_URL } from '@config/config';
import { ENDINGS_BASE } from '@/constants/endpoints';

interface ResetGameResponse {
  message: string;
  status: number;
}

export const resetGame = async (userId: string): Promise<ResetGameResponse> => {
  try {
    console.log('게임 초기화 요청:', { userId, url: `${API_URL}${ENDINGS_BASE}/reset` });

    const response = await axios.post<ResetGameResponse>(
      `${API_URL}${ENDINGS_BASE}/reset`,
      {},
      {
        headers: {
          'user-id': userId,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('게임 초기화 성공:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('게임 초기화 API 에러:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      const serverMessage = error.response?.data?.message || '게임 초기화에 실패했습니다.';
      throw new Error(serverMessage);
    }
    console.error('게임 초기화 알 수 없는 에러:', error);
    throw new Error('게임 초기화 실패: 알 수 없는 에러');
  }
};
