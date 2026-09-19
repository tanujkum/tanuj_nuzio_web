import axiosInstance from './axiosInstance';

export const saveOnboardingApi = (body) => axiosInstance.put('/onboarding', body);