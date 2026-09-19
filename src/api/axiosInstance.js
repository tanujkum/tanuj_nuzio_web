import axios from 'axios';

let store;
export const injectStore = (_store) => {
  store = _store;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = store?.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token expire / invalid ho to logout (string type se dispatch, taaki circular import na bane)
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && store?.getState().auth.token) {
      store.dispatch({ type: 'auth/logout' });
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;