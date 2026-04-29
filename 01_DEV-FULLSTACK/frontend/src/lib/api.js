import axios from 'axios';

// 1. Buat instance Axios
const api = axios.create({
  // Ganti dengan link Gateway Node.js kamu yang di Railway nanti
  baseURL: 'http://localhost:3000/api', // Contoh: 'https://gateway-railway-production.up.railway.app/api'
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ==' // Sesuai dengan di Node.js Gateway
  }
});

// 2. Interceptor untuk otomatis nambahin Token Bearer (Biar nggak nulis manual terus)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * REUSABLE API FUNCTIONS
 */

// Helper umum untuk GET
export async function apiGet(path) {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengambil data");
  }
}

// Helper umum untuk POST
export async function apiPost(path, body) {
  try {
    const response = await api.post(path, body);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengirim data");
  }
}

/**
 * SPECIFIC SERVICES
 */

export async function getActivities() {
    // Karena sudah pakai axios instance 'api', 
    // endpoint otomatis nyambung ke baseURL + '/activities'
    // Header API Key dan Bearer Token sudah otomatis terpasang
    return await apiGet('/activities');
}

// Tambahan contoh untuk Login (Biasanya nggak butuh Bearer token di awal)
export async function loginUser(credentials) {
    return await apiPost('/login', credentials);
}

export default api;