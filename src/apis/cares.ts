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


