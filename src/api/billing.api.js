import axiosInstance from './axiosInstance';

export const getPlansApi = () => axiosInstance.get('/plans');
export const getCurrentSubscriptionApi = () => axiosInstance.get('/subscriptions/current');
export const subscribeApi = (planId) => axiosInstance.post('/subscriptions', { planId });