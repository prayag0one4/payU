import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddMoney from './pages/AddMoney'
import SendMoney from './pages/SendMoney'
import Transactions from './pages/Transactions'

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1f2937',
                            color: '#f9fafb',
                            border: '1px solid #374151',
                            borderRadius: '12px',
                        },
                        success: { iconTheme: { primary: '#6366f1', secondary: '#f9fafb' } },
                    }}
                />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout><Dashboard /></Layout>
                        </ProtectedRoute>
                    } />
                    <Route path="/add-money" element={
                        <ProtectedRoute>
                            <Layout><AddMoney /></Layout>
                        </ProtectedRoute>
                    } />
                    <Route path="/send" element={
                        <ProtectedRoute>
                            <Layout><SendMoney /></Layout>
                        </ProtectedRoute>
                    } />
                    <Route path="/transactions" element={
                        <ProtectedRoute>
                            <Layout><Transactions /></Layout>
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
