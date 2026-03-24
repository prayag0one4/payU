import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const { login, loading } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await login(form.email, form.password)
        if (result.success) {
            toast.success('Welcome back! 👋')
            navigate('/')
        } else {
            toast.error(result.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl text-2xl font-bold mb-4">₹</div>
                    <h1 className="text-3xl font-bold text-white">Welcome back</h1>
                    <p className="text-gray-400 mt-2">Sign in to your PayU wallet</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Email address</label>
                            <input
                                id="email"
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            id="login-btn"
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
