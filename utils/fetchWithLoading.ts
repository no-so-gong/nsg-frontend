// API 호출마다 로딩을 자동 처리할 수 있습니다. 
import useLoadingStore from '../zustand/useLoadingStore';

export const fetchWithLoading = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  const { setLoading } = useLoadingStore.getState();

  try {
    setLoading(true);     
    const result = await apiCall(); 
    return result;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);     
  }
};
