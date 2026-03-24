import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user')
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })
    const [token, setToken] = useState(() => localStorage.getItem('token') || null)
    const [loading, setLoading] = useState(false)

    const login = useCallback(async (email, password) => {
        setLoading(true)
        try {
            const { data } = await api.post('/auth/login', { email, password })
            const { user: u, token: t } = data.data
            localStorage.setItem('token', t)
            localStorage.setItem('user', JSON.stringify(u))
            setToken(t)
            setUser(u)
            return { success: true }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Login failed' }
        } finally {
            setLoading(false)
        }
    }, [])

    const register = useCallback(async (name, email, password) => {
        setLoading(true)
        try {
            const { data } = await api.post('/auth/register', { name, email, password })
            const { user: u, token: t } = data.data
            localStorage.setItem('token', t)
            localStorage.setItem('user', JSON.stringify(u))
            setToken(t)
            setUser(u)
            return { success: true }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' }
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }, [])

    const refreshUser = useCallback(async () => {
        if (!token) return
        try {
            const { data } = await api.get('/user/me')
            const updated = data.data
            localStorage.setItem('user', JSON.stringify(updated))
            setUser(updated)
        } catch (err) {
            console.error('Failed to refresh user:', err)
        }
    }, [token])

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
