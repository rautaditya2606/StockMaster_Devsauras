import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getStockLevels: (id) => api.get(`/products/${id}/stock-levels`),
  };

  // Warehouses API
  export const warehousesAPI = {
    getAll: () => api.get('/warehouses'),
    getById: (id) => api.get(`/warehouses/${id}`),
    create: (data) => api.post('/warehouses', data),
    update: (id, data) => api.put(`/warehouses/${id}`, data),
    delete: (id) => api.delete(`/warehouses/${id}`),
    getStock: (id) => api.get(`/warehouses/${id}/stock`),
  };

  // Receipts API
  export const receiptsAPI = {
    getAll: (params) => api.get('/receipts', { params }),
    getById: (id) => api.get(`/receipts/${id}`),
    create: (data) => api.post('/receipts', data),
    addItem: (id, data) => api.post(`/receipts/${id}/items`, data),
    updateStatus: (id, status) => api.put(`/receipts/${id}/status`, { status }),
    validate: (id) => api.post(`/receipts/${id}/validate`),
    deleteItem: (id, itemId) => api.delete(`/receipts/${id}/items/${itemId}`),
  };

  // Deliveries API
  export const deliveriesAPI = {
    getAll: (params) => api.get('/deliveries', { params }),
    getById: (id) => api.get(`/deliveries/${id}`),
    create: (data) => api.post('/deliveries', data),
    addItem: (id, data) => api.post(`/deliveries/${id}/items`, data),
    updateStatus: (id, status) => api.put(`/deliveries/${id}/status`, { status }),
    validate: (id) => api.post(`/deliveries/${id}/validate`),
    deleteItem: (id, itemId) => api.delete(`/deliveries/${id}/items/${itemId}`),
  };

  // Transfers API
  export const transfersAPI = {
    getAll: (params) => api.get('/transfers', { params }),
    getById: (id) => api.get(`/transfers/${id}`),
    create: (data) => api.post('/transfers', data),
    addItem: (id, data) => api.post(`/transfers/${id}/items`, data),
    updateStatus: (id, status) => api.put(`/transfers/${id}/status`, { status }),
    validate: (id) => api.post(`/transfers/${id}/validate`),
    deleteItem: (id, itemId) => api.delete(`/transfers/${id}/items/${itemId}`),
  };

  // Adjustments API
  export const adjustmentsAPI = {
    getAll: (params) => api.get('/adjustments', { params }),
    getById: (id) => api.get(`/adjustments/${id}`),
    create: (data) => api.post('/adjustments', data),
  };

  // Ledger API
  export const ledgerAPI = {
    getAll: (params) => api.get('/ledger', { params }),
    getProductLedger: (productId, params) => api.get(`/ledger/product/${productId}`, { params }),
    getWarehouseLedger: (warehouseId, params) => api.get(`/ledger/warehouse/${warehouseId}`, { params }),
  };

  // Dashboard API
  export const dashboardAPI = {
    // Accept an optional warehouseId which will be passed as a query param
    getKPIs: (warehouseId = null) => api.get('/dashboard/kpis', { params: warehouseId ? { warehouseId } : {} }),
    getStockByCategory: (warehouseId) => api.get('/dashboard/charts/stock-by-category', { params: { warehouseId } }),
    getStockHistory: (warehouseId, days = 30) => api.get('/dashboard/charts/stock-history', { params: { warehouseId, days } }),
    getWarehouseStockDistribution: () => api.get('/dashboard/charts/warehouse-distribution'),
    getTopProducts: (warehouseId, limit = 10) => api.get('/dashboard/charts/top-products', { params: { warehouseId, limit } }),
  };

  // Tasks API
  export const tasksAPI = {
    create: (data) => api.post('/tasks', data),
    getForManager: () => api.get('/tasks/manager'),
    getForWorker: () => api.get('/tasks/worker'),
    updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  };

  // Users API
  export const usersAPI = {
    getAll: () => api.get('/users'),
  };

  export default api;

