import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import WatchlistPage from "./pages/WatchlistPage";
import TransactionsPage from "./pages/TransactionsPage";
import InsightsPage from "./pages/InsightsPage";
import MarketPage from "./pages/MarketPage";
import ReportsPage from "./pages/ReportsPage";
import UserPanelPage from "./pages/UserPanelPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import StockDetailsPage from "./pages/StockDetailsPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppShell from "./components/common/AppShell";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="market" element={<MarketPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        <Route path="/watchlist" element={<Navigate to="/dashboard/watchlist" replace />} />
        <Route path="/transactions" element={<Navigate to="/dashboard/transactions" replace />} />
        <Route path="/insights" element={<Navigate to="/dashboard/insights" replace />} />
        <Route path="/market" element={<Navigate to="/dashboard/market" replace />} />
        <Route path="/reports" element={<Navigate to="/dashboard/reports" replace />} />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPanelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stocks/:symbol"
          element={
            <ProtectedRoute>
              <StockDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
