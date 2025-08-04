import axios from 'axios';
import { API_URL } from '@config/config';
import { EVENT_BASE } from '@/constants/endpoints';

interface Reward {
  type: string;
  amount: number;
}

interface AttendanceDay {
  day: number;
  reward: number;
  checkedIn: boolean;
}

interface AttendanceResponse {
  message: string;
  status: number;
  data: {
    alreadyCheckedIn: boolean;
    totalAttendance: number;
    todayIndex: number;
    todayReward: Reward;
    board: AttendanceDay[];
  };
}

// 출석 정보 조회 (GET)
export const getAttendanceBoard = async (userId: string): Promise<AttendanceResponse> => {
  try {
    const response = await axios.get<AttendanceResponse>(`${API_URL}${EVENT_BASE}/attendance`, {
      headers: {
        'user-id': userId,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '출석 정보 조회 실패');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('출석 정보 조회 실패: 알 수 없는 에러');
    }
  }
};

// 출석 체크 (POST)
export const postAttendanceCheckin = async (userId: string): Promise<AttendanceResponse> => {
  try {
    const response = await axios.post<AttendanceResponse>(`${API_URL}${EVENT_BASE}/attendance/checkin`, null, {
      headers: {
        'user-id': userId,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '출석 체크 실패');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('출석 체크 실패: 알 수 없는 에러');
    }
  }
};
