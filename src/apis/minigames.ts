import axios from 'axios';
import { API_URL } from '@config/config';
import { MINIGAME_BASE } from '@/constants/endpoints';

// 미니게임 시작 응답 타입
export interface MinigameStartResponse {
  message: string;
  data: {
    canPlay: boolean;
    remainingPlays: number;
    gameId: number;
  };
  status: number;
}

// 미니게임 결과 요청 타입
export interface MinigameResultRequest {
  score: number | null;
  money: number | null;
  timeSpent: number | null;
  startedAt: string;
  completedAt: string | null;
}

// 미니게임 결과 응답 타입
export interface MinigameResultData {
  startedAt: string;
  completedAt: string | null;
  score: number | null;
  timeSpent: number | null;
  money: number | null;
  gameId: number;
}

export interface MinigameResultResponse {
  status: number;
  message: string;
  data: {
    minigameResult: MinigameResultData;
  };
}

export const startMinigame = async (
  gameId: number,
  userId: string
): Promise<MinigameStartResponse> => {
  try {
    const response = await axios.post<MinigameStartResponse>(
      `${API_URL}${MINIGAME_BASE}/${gameId}/start`,
      {},
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
      const serverMessage = error.response?.data?.message || '미니게임 시작에 실패했습니다.';
      throw new Error(serverMessage);
    }
    throw new Error('알 수 없는 오류로 미니게임 시작에 실패했습니다.');
  }
};

export const submitMinigameResult = async (
  gameId: number,
  resultData: MinigameResultRequest,
  userId: string
): Promise<MinigameResultResponse> => {
  try {
    const response = await axios.post<MinigameResultResponse>(
      `${API_URL}${MINIGAME_BASE}/${gameId}/result`,
      resultData,
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
      const serverMessage = error.response?.data?.message || '미니게임 결과 제출에 실패했습니다.';
      throw new Error(serverMessage);
    }
    throw new Error('알 수 없는 오류로 미니게임 결과 제출에 실패했습니다.');
  }
};
