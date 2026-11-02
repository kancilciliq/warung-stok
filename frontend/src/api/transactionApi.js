import http from './http';

export const transactionApi = {
  list: (params) => http.get('/transactions', { params }).then((r) => r.data.data),
  get: (id) => http.get(`/transactions/${id}`).then((r) => r.data.data),
  create: (payload) => http.post('/transactions', payload).then((r) => r.data),
};
