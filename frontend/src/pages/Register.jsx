import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Register = () => {
    const { register, loading } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match.')
            return
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters.')
            return
        }
        const result = await register(form.name, form.email, form.password)
        if (result.success) {
            toast.success('Account created! Welcome to PayU 🎉')
            navigate('/')
        } else {
            toast.error(result.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl text-2xl font-bold mb-4">₹</div>
                    <h1 className="text-3xl font-bold text-white">Create account</h1>
                    <p className="text-gray-400 mt-2">Start your PayU wallet journey</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Full name</label>
                            <input
                                id="name"
                                type="text"
                                className="input-field"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
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
                                placeholder="Min 6 characters"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Confirm password</label>
                            <input
                                id="confirm-password"
                                type="password"
                                className="input-field"
                                placeholder="Repeat password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            id="register-btn"
                            type="submit"
                            className="btn-primary w-full mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
