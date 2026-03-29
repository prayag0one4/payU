import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const AMOUNTS = [100, 200, 500, 1000, 2000, 5000]

// Fake card number formatter
const formatCard = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

const formatExpiry = (val) =>
    val.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2')

const MockPaymentModal = ({ amount, onSuccess, onClose }) => {
    const [card, setCard] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvv, setCvv] = useState('')
    const [name, setName] = useState('')
    const [processing, setProcessing] = useState(false)

    const handlePay = async (e) => {
        e.preventDefault()
        // Basic fake validation
        if (card.replace(/\s/g, '').length < 16) { toast.error('Enter a valid 16-digit card number'); return }
        if (expiry.length < 5) { toast.error('Enter a valid expiry date'); return }
        if (cvv.length < 3) { toast.error('Enter a valid CVV'); return }
        if (!name.trim()) { toast.error('Enter the cardholder name'); return }

        setProcessing(true)
        // Simulate network delay (1.5s)
        await new Promise((r) => setTimeout(r, 1500))
        setProcessing(false)
        onSuccess()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start gap-2 justify-between px-4 sm:px-6 py-4 border-b border-gray-800">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Secure Payment</p>
                        <p className="text-xl font-bold text-white mt-0.5">
                            ₹{parseFloat(amount).toFixed(2)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span className="text-xs bg-green-900/60 text-green-400 border border-green-800 rounded-full px-2.5 py-0.5">🔒 Safe & Secure</span>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Card form */}
                <form onSubmit={handlePay} className="p-4 sm:p-6 space-y-4">
                    {/* Card number */}
                    <div>
                        <label className="label">Card Number</label>
                        <div className="relative">
                            <input
                                id="card-number"
                                type="text"
                                className="input-field pr-14"
                                placeholder="1234 5678 9012 3456"
                                value={card}
                                onChange={(e) => setCard(formatCard(e.target.value))}
                                maxLength={19}
                                required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">💳</span>
                        </div>
                    </div>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Expiry</label>
                            <input
                                id="expiry"
                                type="text"
                                className="input-field"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                maxLength={5}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">CVV</label>
                            <input
                                id="cvv"
                                type="password"
                                className="input-field"
                                placeholder="•••"
                                maxLength={4}
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                required
                            />
                        </div>
                    </div>

                    {/* Cardholder name */}
                    <div>
                        <label className="label">Cardholder Name</label>
                        <input
                            id="cardholder-name"
                            type="text"
                            className="input-field"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Pay button */}
                    <button
                        id="pay-now-btn"
                        type="submit"
                        className="btn-primary w-full mt-2"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing payment...
                            </>
                        ) : (
                            <>💳 Pay ₹{parseFloat(amount).toFixed(2)}</>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-600">
                        🔒 This is a simulated payment — no real charges will be made.
                    </p>
                </form>
            </div>
        </div>
    )
}

const AddMoney = () => {
    const { refreshUser } = useAuth()
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleProceed = (e) => {
        e.preventDefault()
        const amt = parseFloat(amount)
        if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return }
        if (amt > 500000) { toast.error('Maximum ₹5,00,000'); return }
        setShowModal(true)
    }

    const handlePaymentSuccess = async () => {
        setShowModal(false)
        setLoading(true)
        try {
            await api.post('/wallet/add-money', { amount: parseFloat(amount) })
            toast.success(`₹${parseFloat(amount).toFixed(2)} added to your wallet! 💰`)
            await refreshUser()
            setAmount('')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add money')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {showModal && (
                <MockPaymentModal
                    amount={amount}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => setShowModal(false)}
                />
            )}

            <div className="max-w-lg animate-fade-in">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Add Money</h1>
                    <p className="text-gray-400 mt-1">Top up your PayU wallet instantly</p>
                </div>

                <div className="card">
                    <form onSubmit={handleProceed} className="space-y-6">
                        {/* Quick amount selection */}
                        <div>
                            <label className="label">Quick amounts</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {AMOUNTS.map((a) => (
                                    <button
                                        key={a}
                                        type="button"
                                        onClick={() => setAmount(String(a))}
                                        className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all duration-200 ${amount === String(a)
                                                ? 'bg-brand-600 border-brand-500 text-white'
                                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-brand-600/50 hover:text-white'
                                            }`}
                                    >
                                        ₹{a.toLocaleString('en-IN')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom amount */}
                        <div>
                            <label className="label">Or enter custom amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                                <input
                                    id="amount"
                                    type="number"
                                    min="1"
                                    max="500000"
                                    step="0.01"
                                    className="input-field pl-8"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Info banner */}
                        <div className="bg-gray-800/60 rounded-xl p-4 text-sm text-gray-400 flex gap-3">
                            <span className="text-lg mt-0.5">ℹ️</span>
                            <p>This is a demo app. You can add any amount — no real payment is processed.</p>
                        </div>

                        <button
                            id="add-money-btn"
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading || !amount}
                        >
                            {loading ? (
                                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            {loading ? 'Adding money...' : `Proceed to Pay ₹${parseFloat(amount || 0).toFixed(2)}`}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddMoney
