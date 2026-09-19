import axiosInstance from './axiosInstance';

export const getOnboardingMetaApi = () => axiosInstance.get('/meta/onboarding');