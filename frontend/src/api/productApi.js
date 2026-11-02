import http from './http';
import { createCrudApi } from './crudApi';

export const productApi = {
  ...createCrudApi('products'),
  lowStock: () => http.get('/products/low-stock').then((r) => r.data.data),
};
