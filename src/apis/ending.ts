import axios from 'axios';
import { API_URL } from '@config/config';
import { ENDING_BASE } from '@/constants/endpoints';

export interface EndingSummaryData {
  consecutiveAttendanceDays: number;
  totalUsedMoney: number;
  runawayCount: number;
  totalPlayDays: number;
}

interface ErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

interface ValidationError {
  detail: ErrorDetail[];
}

export const getEndingSummary = async (userId: string): Promise<EndingSummaryData> => {
  try {
    const response = await axios.get<EndingSummaryData>(`${API_URL}${ENDING_BASE}/summary`, {
        headers: {
        'user-id': userId,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as ValidationError;
      const message = errorData.detail?.[0]?.msg || '알 수 없는 서버 오류가 발생했습니다.';
      throw new Error(message);
    }
    console.error('엔딩 요약 정보를 가져오는 중 에러 발생:', error);
    throw new Error('요청 중 문제가 발생했습니다.');
  }
};