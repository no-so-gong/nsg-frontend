import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';
console.log('🔍 API_URL:', API_URL);
