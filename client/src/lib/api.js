import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('trendz_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem('trendz_token')) {
      const onAdmin = window.location.pathname.startsWith('/admin');
      if (onAdmin && !window.location.pathname.endsWith('/admin/login')) {
        localStorage.removeItem('trendz_token');
        localStorage.removeItem('trendz_admin');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong';

export const authApi = {
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  changePassword: (data) => api.put('/auth/change-password', data).then((r) => r.data),
};

export const projectApi = {
  list: (params) => api.get('/projects', { params }).then((r) => r.data),
  bySlug: (slug) => api.get(`/projects/slug/${slug}`).then((r) => r.data),
  byId: (id) => api.get(`/projects/${id}`).then((r) => r.data),
  create: (data) => api.post('/projects', data).then((r) => r.data),
  update: (id, data) => api.put(`/projects/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/projects/${id}`).then((r) => r.data),
};

export const categoryApi = {
  list: () => api.get('/categories').then((r) => r.data),
  create: (data) => api.post('/categories', data).then((r) => r.data),
  update: (id, data) => api.put(`/categories/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};

export const serviceApi = {
  list: () => api.get('/services').then((r) => r.data),
  bySlug: (slug) => api.get(`/services/slug/${slug}`).then((r) => r.data),
  create: (data) => api.post('/services', data).then((r) => r.data),
  update: (id, data) => api.put(`/services/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/services/${id}`).then((r) => r.data),
};

export const testimonialApi = {
  list: () => api.get('/testimonials').then((r) => r.data),
  create: (data) => api.post('/testimonials', data).then((r) => r.data),
  update: (id, data) => api.put(`/testimonials/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/testimonials/${id}`).then((r) => r.data),
};

export const enquiryApi = {
  list: (params) => api.get('/enquiries', { params }).then((r) => r.data),
  byId: (id) => api.get(`/enquiries/${id}`).then((r) => r.data),
  create: (data) => api.post('/enquiries', data).then((r) => r.data),
  update: (id, data) => api.put(`/enquiries/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/enquiries/${id}`).then((r) => r.data),
  uploadImages: (formData) =>
    api
      .post('/enquiries/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
};

export const materialApi = {
  list: () => api.get('/materials').then((r) => r.data),
  create: (data) => api.post('/materials', data).then((r) => r.data),
  update: (id, data) => api.put(`/materials/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/materials/${id}`).then((r) => r.data),
};

export const collectionApi = {
  list: () => api.get('/collections').then((r) => r.data),
  create: (data) => api.post('/collections', data).then((r) => r.data),
  update: (id, data) => api.put(`/collections/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/collections/${id}`).then((r) => r.data),
};

export const galleryApi = {
  list: () => api.get('/gallery').then((r) => r.data),
  create: (data) => api.post('/gallery', data).then((r) => r.data),
  update: (id, data) => api.put(`/gallery/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/gallery/${id}`).then((r) => r.data),
};

export const settingsApi = {
  get: () => api.get('/settings').then((r) => r.data),
  save: (settings) => api.put('/settings', { settings }).then((r) => r.data),
};

export const uploadApi = {
  upload: (formData) =>
    api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  remove: (data) => api.delete('/upload', { data }).then((r) => r.data),
};

export default api;
