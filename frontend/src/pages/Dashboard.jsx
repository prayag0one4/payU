import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const StatCard = ({ label, value, icon, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        </div>
    </div>
)

const QuickAction = ({ to, icon, label, desc, color }) => (
    <Link to={to} className="card hover:border-brand-600/50 hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer block">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${color} group-hover:scale-110 transition-transform duration-200`}>{icon}</div>
        <p className="font-semibold text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </Link>
)

const Dashboard = () => {
    const { user, refreshUser } = useAuth()
    const [recentTx, setRecentTx] = useState([])
    const [txLoading, setTxLoading] = useState(true)

    useEffect(() => {
        refreshUser()
        fetchRecentTransactions()
    }, [])

    const fetchRecentTransactions = async () => {
        try {
            const { data } = await api.get('/transactions?limit=5')
            setRecentTx(data.data.transactions)
        } catch {
            toast.error('Failed to load transactions')
        } finally {
            setTxLoading(false)
        }
    }

    const formatBalance = (bal) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(bal ?? 0)

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

    const badgeClass = (s) =>
        s === 'SUCCESS' ? 'badge-success' : s === 'PENDING' ? 'badge-pending' : 'badge-failed'

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="text-gray-400 mt-1">Here's your wallet overview</p>
            </div>

            {/* Balance card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                <p className="text-brand-200 text-sm font-medium relative">Total Balance</p>
                <p className="text-4xl font-bold text-white mt-2 relative">{formatBalance(user?.balance)}</p>
                <p className="text-brand-300 text-xs mt-3 relative">Updated just now</p>
            </div>

            {/* Quick actions */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
                <div className="grid grid-cols-3 gap-4">
                    <QuickAction to="/add-money" icon="➕" label="Add Money" desc="Top up wallet" color="bg-green-900/60" />
                    <QuickAction to="/send" icon="📤" label="Send Money" desc="Transfer to anyone" color="bg-blue-900/60" />
                    <QuickAction to="/transactions" icon="📋" label="History" desc="View all activity" color="bg-purple-900/60" />
                </div>
            </div>

            {/* Recent transactions */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                    <Link to="/transactions" className="text-sm text-brand-400 hover:text-brand-300">View all →</Link>
                </div>
                <div className="card p-0 overflow-hidden">
                    {txLoading ? (
                        <div className="space-y-0">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-800 last:border-0 animate-pulse">
                                    <div className="w-10 h-10 bg-gray-700 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-700 rounded w-1/3" />
                                        <div className="h-2 bg-gray-800 rounded w-1/4" />
                                    </div>
                                    <div className="h-4 bg-gray-700 rounded w-16" />
                                </div>
                            ))}
                        </div>
                    ) : recentTx.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <p className="text-3xl mb-2">💳</p>
                            <p>No transactions yet.</p>
                        </div>
                    ) : (
                        recentTx.map((tx) => {
                            const isCredit = tx.receiverId === user?.id
                            return (
                                <div key={tx.id} className="flex items-center gap-4 p-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isCredit ? 'bg-green-900/60' : 'bg-red-900/60'}`}>
                                        {tx.type === 'ADD_MONEY' ? '💰' : isCredit ? '📥' : '📤'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">
                                            {tx.type === 'ADD_MONEY' ? 'Added to wallet' : isCredit ? `From ${tx.sender?.name ?? 'Unknown'}` : `To ${tx.receiver?.name ?? 'Unknown'}`}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(tx.createdAt)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                                            {isCredit ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
                                        </p>
                                        <span className={badgeClass(tx.status)}>{tx.status}</span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'morning'
    if (h < 18) return 'afternoon'
    return 'evening'
}

export default Dashboard
