import http from './http';

export const reportApi = {
  dashboard: () => http.get('/dashboard').then((r) => r.data.data),
  stock: (params) => http.get('/reports/stock', { params }).then((r) => r.data.data),
  history: (params) => http.get('/reports/history', { params }).then((r) => r.data.data),
};
