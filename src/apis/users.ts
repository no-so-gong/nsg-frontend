import axios from 'axios';
import { API_URL } from '@config/config';
import { USER_BASE } from '@/constants/endpoints';
import useUserStore from '@zustand/useUserStore';

interface UserPropertyResponse {
  money: number;
  message: string;
  status: number;
}

interface TransactionPayload {
  amount: number;
  source: string;
}

interface TransactionResponse {
  txId: string;
  userId: string;
  amount: number;
  source: string;
  direction: 'in' | 'out';
  currentMoney: number;
  createdAt: string;
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

// 미완 
export const addUserMoney = async (userId: string, amount: number): Promise<UserPropertyResponse> => {
  try {
    const url = `${API_URL}${USER_BASE}/property/money`; // 디비에 이 사용자에게 이 정도의 골드를 제공해줘!!라고 요청하는 api
    console.log('골드 지급 요청:', { url, userId, amount });

    const response = await axios.patch<UserPropertyResponse>(
      url,
      { amount },
      {
        headers: {
          'user-id': userId,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('골드 지급 API 에러:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        headers: error.config?.headers
      });
      throw error;
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('골드 지급 실패: 알 수 없는 에러');
    }
  }
};

export const processTransaction = async (
  payload: TransactionPayload,
  userId: string
): Promise<TransactionResponse> => {
  if (!userId) throw new Error("사용자 인증이 필요합니다.");

  try {
    const response = await axios.post<TransactionResponse>(
      `${API_URL}${USER_BASE}/transactions`,
      payload,
      {
        headers: {
          'user-id': userId,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message || '결제에 실패했습니다.';
      throw new Error(serverMessage);
    }
    throw new Error('알 수 없는 오류로 결제에 실패했습니다.');
  }
};