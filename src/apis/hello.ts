import axios from 'axios';
import { API_URL } from '@/config/config';

export const getHelloMessage = async () => {
  try {
    const response = await axios.get(`${API_URL}/hello`);
    return response.data.message;
  } catch (error) {
    console.error('API 호출 에러:', error);
    return null;
  }
};
