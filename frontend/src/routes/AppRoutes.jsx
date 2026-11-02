import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProductPage from '../pages/master/ProductPage';
import CategoryPage from '../pages/master/CategoryPage';
import SupplierPage from '../pages/master/SupplierPage';
import UserPage from '../pages/master/UserPage';
import TransactionListPage from '../pages/transactions/TransactionListPage';
import TransactionFormPage from '../pages/transactions/TransactionFormPage';
import HistoryPage from '../pages/reports/HistoryPage';
import StockReportPage from '../pages/reports/StockReportPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="suppliers" element={<SupplierPage />} />

          <Route path="transactions/in" element={<TransactionListPage type="in" />} />
          <Route path="transactions/in/new" element={<TransactionFormPage type="in" />} />
          <Route path="transactions/out" element={<TransactionListPage type="out" />} />
          <Route path="transactions/out/new" element={<TransactionFormPage type="out" />} />

          <Route path="history" element={<HistoryPage />} />
          <Route path="reports" element={<StockReportPage />} />

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="users" element={<UserPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
