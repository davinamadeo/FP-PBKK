// lib/api.ts - Centralized API configuration

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_URL}/auth/register`,
    LOGIN: `${API_URL}/auth/login`,
    ME: `${API_URL}/auth/me`,
  },
  FILES: {
    LIST: `${API_URL}/files`,
    UPLOAD: `${API_URL}/files/upload`,
    DELETE: (id: number) => `${API_URL}/files/${id}`,
  },
  FOLDERS: {
    LIST: `${API_URL}/folders`,
    CREATE: `${API_URL}/folders`,
    DELETE: (id: number) => `${API_URL}/folders/${id}`,
  },
  TAGS: {
    LIST: `${API_URL}/tags`,
    CREATE: `${API_URL}/tags`,
  },
};

// Helper function untuk fetch dengan auth
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
}