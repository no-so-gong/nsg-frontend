import { create } from 'zustand';
import useLoadingStore from '@zustand/useLoadingStore';
import { getCarePriceList } from '@/apis/cares';

type Category = 'feed' | 'play' | 'gift';

interface CacheEntry {
    prices: Record<string, number>;
    fetchedAt: number;
}

interface PriceListState {
    pricesByCategory: Record<Category, Record<string, number> | null>;
    lastFetched: { category: Category; animalId: number; evolutionStage: number } | null;
    error: string | null;
    cache: Record<string, CacheEntry>; // key: `${category}:${animalId}:${evolutionStage}`
    fetchPrices: (params: { category: Category; animalId: number; evolutionStage: number; forceRefresh?: boolean }) => Promise<void>;
    getPrice: (category: Category, key: string) => number | undefined;
}

const usePriceListStore = create<PriceListState>((set, get) => ({
    pricesByCategory: { feed: null, play: null, gift: null },
    lastFetched: null,
    error: null,
    cache: {},
    fetchPrices: async ({ category, animalId, evolutionStage, forceRefresh = false }) => {
        const { setLoading } = useLoadingStore.getState();
        try {
            const cacheKey = `${category}:${animalId}:${evolutionStage}`;
            const cached = get().cache[cacheKey];
            if (cached && !forceRefresh) {
                set((state) => ({
                    pricesByCategory: { ...state.pricesByCategory, [category]: cached.prices },
                    lastFetched: { category, animalId, evolutionStage },
                    error: null,
                }));
                return;
            }
            setLoading(true);
            const data = await getCarePriceList({ category, animalId });
            set((state) => ({
                pricesByCategory: { ...state.pricesByCategory, [category]: data.prices as Record<string, number> },
                lastFetched: { category, animalId, evolutionStage },
                error: null,
                cache: { ...state.cache, [cacheKey]: { prices: data.prices as Record<string, number>, fetchedAt: Date.now() } },
            }));
        } catch (err: any) {
            console.error('가격 조회 실패:', err);
            set({ error: err?.message ?? '가격 정보를 가져오는 중 오류가 발생했습니다.' });
        } finally {
            setLoading(false);
        }
    },
    getPrice: (category, key) => {
        const prices = get().pricesByCategory[category];
        return prices ? prices[key] : undefined;
    },
}));

export default usePriceListStore;


