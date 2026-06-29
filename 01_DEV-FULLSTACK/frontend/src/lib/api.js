import axios from 'axios';

const api = axios.create({
  baseURL: 'https://expressBack.ownspace.my.id/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiGet(path) {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengambil data");
  }
}

export async function apiPost(path, body) {
  try {
    const response = await api.post(path, body);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengirim data");
  }
}


export async function getActivities() {
    return await apiGet('/activities');
}

export async function loginUser(credentials) {
    return await apiPost('/login', credentials);
}

export default api;
