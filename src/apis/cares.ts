import axios from 'axios';
import { API_URL } from '@config/config';
import { CARE_BASE } from '@/constants/endpoints';
import useUserStore from '@zustand/useUserStore';

export type CareCategory = 'feed' | 'play' | 'gift';

export interface CarePriceListResponse {
    animalId: number;
    evolutionStage: number;
    category: CareCategory;
    prices: Record<string, number>;
    message: string;
    status: number;
}

interface CareActionPayload {
    animal_id: number;
    action_id: number;
}

interface CareActionResponse {
    predictedDelta: number;
    newEmotion: number;
    previousEmotion: number;
    actionPerformed: string;
    message: string;
    status: number;
}

export async function getCarePriceList(params: { category: CareCategory; animalId: number }): Promise<CarePriceListResponse> {
    const { category, animalId } = params;
    const url = `${API_URL}${CARE_BASE}/pricelist`;
    const { userId } = useUserStore.getState();
    try {
        const response = await axios.get<CarePriceListResponse>(url, {
            params: { category, animalId },
            headers: userId ? { 'user-id': userId } : undefined,
        });
        return response.data;
    } catch (e: any) {
        const serverMessage = e?.response?.data?.message || e?.message || 'Unknown error';
        throw new Error(serverMessage);
    }
}

export const performCareAction = async (
    payload: CareActionPayload,
    userId: string
): Promise<CareActionResponse> => {
    if (!userId) throw new Error("사용자 인증이 필요합니다.");

    try {
        const response = await axios.post<CareActionResponse>(
            `${API_URL}${CARE_BASE}/action`,
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
            const serverMessage = error.response?.data?.message || '아이템 사용에 실패했습니다.';
            throw new Error(serverMessage);
        }
        throw new Error('알 수 없는 오류로 아이템 사용에 실패했습니다.');
    }
};