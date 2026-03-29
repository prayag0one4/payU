import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
    { to: '/', label: 'Dashboard', icon: '🏠' },
    { to: '/add-money', label: 'Add Money', icon: '➕' },
    { to: '/send', label: 'Send Money', icon: '📤' },
    { to: '/transactions', label: 'Transactions', icon: '📋' },
]

const SidebarContent = ({ user, onLogout, onNavigate }) => (
    <>
        <div className="px-6 py-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-lg font-bold">₹</div>
                <span className="text-xl font-bold text-white">PayU</span>
            </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-900 rounded-full flex items-center justify-center text-brand-300 font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map(({ to, label, icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                            ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                            : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                        }`
                    }
                >
                    <span className="text-base">{icon}</span>
                    {label}
                </NavLink>
            ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-800">
            <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                 text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200"
            >
                <span className="text-base">🚪</span>
                Logout
            </button>
        </div>
    </>
)

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
        onClose?.()
    }

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 lg:w-64 lg:max-w-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="flex items-center justify-end border-b border-gray-800 px-4 py-3 lg:hidden">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 text-gray-300"
                        aria-label="Close navigation"
                    >
                        ✕
                    </button>
                </div>

                <SidebarContent user={user} onLogout={handleLogout} onNavigate={onClose} />
            </aside>
        </>
    )
}

export default Sidebar
