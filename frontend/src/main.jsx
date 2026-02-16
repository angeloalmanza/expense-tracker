import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import GoogleCallbackPage from './pages/GoogleCallbackPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import RecurringPage from './pages/RecurringPage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuthContext()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : children
}

const Root = () => (
  <AuthProvider>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
          <Route path="/auth/callback" element={<GoogleCallbackPage />} />
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="recurring" element={<RecurringPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </AuthProvider>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
