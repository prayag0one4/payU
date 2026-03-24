import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const FILTERS = [
    { label: 'All', value: '' },
    { label: 'Add Money', value: 'ADD_MONEY' },
    { label: 'Transfer', value: 'TRANSFER' },
]

const STATUS_FILTERS = [
    { label: 'All', value: '' },
    { label: 'Success', value: 'SUCCESS' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Failed', value: 'FAILED' },
]

const badgeClass = (s) =>
    s === 'SUCCESS' ? 'badge-success' : s === 'PENDING' ? 'badge-pending' : 'badge-failed'

const Transactions = () => {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [typeFilter, setTypeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })

    const fetchTransactions = useCallback(async (page = 1) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ page, limit: 10 })
            if (typeFilter) params.set('type', typeFilter)
            if (statusFilter) params.set('status', statusFilter)
            const { data } = await api.get(`/transactions?${params}`)
            setTransactions(data.data.transactions)
            setPagination(data.data.pagination)
        } catch {
            toast.error('Failed to load transactions')
        } finally {
            setLoading(false)
        }
    }, [typeFilter, statusFilter])

    useEffect(() => { fetchTransactions(1) }, [fetchTransactions])

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    const FilterBtn = ({ active, onClick, label }) => (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${active
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
        >
            {label}
        </button>
    )

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Transactions</h1>
                <p className="text-gray-400 mt-1">Your complete payment history</p>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex flex-wrap gap-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Type</p>
                        <div className="flex gap-2">
                            {FILTERS.map(({ label, value }) => (
                                <FilterBtn
                                    key={value}
                                    label={label}
                                    active={typeFilter === value}
                                    onClick={() => setTypeFilter(value)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Status</p>
                        <div className="flex gap-2">
                            {STATUS_FILTERS.map(({ label, value }) => (
                                <FilterBtn
                                    key={value}
                                    label={label}
                                    active={statusFilter === value}
                                    onClick={() => setStatusFilter(value)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {pagination.total > 0 && (
                    <p className="text-xs text-gray-500 mt-3">{pagination.total} transaction{pagination.total !== 1 ? 's' : ''} found</p>
                )}
            </div>

            {/* Transaction list */}
            <div className="card p-0 overflow-hidden">
                {loading ? (
                    <div className="space-y-0">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-800 last:border-0 animate-pulse">
                                <div className="w-10 h-10 bg-gray-700 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-700 rounded w-1/3" />
                                    <div className="h-2 bg-gray-800 rounded w-1/5" />
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="h-4 bg-gray-700 rounded w-20" />
                                    <div className="h-3 bg-gray-800 rounded w-14 ml-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="font-medium">No transactions found</p>
                        <p className="text-sm mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    transactions.map((tx) => {
                        const isCredit = tx.receiverId === user?.id
                        return (
                            <div
                                key={tx.id}
                                className="flex items-center gap-4 p-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors"
                            >
                                <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-lg ${isCredit ? 'bg-green-900/60' : 'bg-red-900/60'}`}>
                                    {tx.type === 'ADD_MONEY' ? '💰' : isCredit ? '📥' : '📤'}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {tx.type === 'ADD_MONEY'
                                            ? 'Added to wallet'
                                            : isCredit
                                                ? `Received from ${tx.sender?.name ?? 'Unknown'}`
                                                : `Sent to ${tx.receiver?.name ?? 'Unknown'}`}
                                    </p>
                                    {tx.note && <p className="text-xs text-gray-500 mt-0.5 truncate">"{tx.note}"</p>}
                                    <p className="text-xs text-gray-600 mt-0.5">{formatDate(tx.createdAt)}</p>
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <p className={`text-sm font-bold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                                        {isCredit ? '+' : '-'}₹{parseFloat(tx.amount).toFixed(2)}
                                    </p>
                                    <div className="mt-1">
                                        <span className={badgeClass(tx.status)}>{tx.status}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                        Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            id="prev-page"
                            onClick={() => fetchTransactions(pagination.page - 1)}
                            disabled={!pagination.hasPrev || loading}
                            className="btn-secondary text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            ← Prev
                        </button>
                        <button
                            id="next-page"
                            onClick={() => fetchTransactions(pagination.page + 1)}
                            disabled={!pagination.hasNext || loading}
                            className="btn-secondary text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Transactions
