import axiosInstance from './axiosInstance';

export const getBriefApi = () => axiosInstance.get('/brief/today');
export const listStoriesApi = (params) => axiosInstance.get('/stories', { params });
export const saveStoryApi = (id) => axiosInstance.post(`/stories/${id}/save`);
export const unsaveStoryApi = (id) => axiosInstance.delete(`/stories/${id}/save`);