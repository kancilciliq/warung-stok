import http from './http';

// Pabrik service API untuk resource CRUD standar
export const createCrudApi = (resource) => ({
  list: (params) => http.get(`/${resource}`, { params }).then((r) => r.data.data),
  get: (id) => http.get(`/${resource}/${id}`).then((r) => r.data.data),
  create: (payload) => http.post(`/${resource}`, payload).then((r) => r.data),
  update: (id, payload) => http.put(`/${resource}/${id}`, payload).then((r) => r.data),
  remove: (id) => http.delete(`/${resource}/${id}`).then((r) => r.data),
});
