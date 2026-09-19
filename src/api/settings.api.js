import axiosInstance from './axiosInstance';

export const updateSettingsApi = (body) => axiosInstance.patch('/settings', body);