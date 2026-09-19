import axiosInstance from './axiosInstance';

export const devLoginApi = (body) => axiosInstance.post('/auth/dev-login', body);
export const googleLoginApi = (body) => axiosInstance.post('/auth/google', body);
export const meApi = () => axiosInstance.get('/auth/me');