import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const SendMoney = () => {
    const { user, refreshUser } = useAuth()
    const [form, setForm] = useState({ recipientEmail: '', amount: '', note: '' })
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(null)
    const [step, setStep] = useState('form') // 'form' | 'confirm'

    const handlePreview = (e) => {
        e.preventDefault()
        const amt = parseFloat(form.amount)
        if (!form.recipientEmail) { toast.error('Recipient email is required'); return }
        if (form.recipientEmail === user?.email) { toast.error("Can't send money to yourself"); return }
        if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return }
        if (amt > parseFloat(user?.balance ?? 0)) {
            toast.error(`Insufficient balance. Available: ₹${parseFloat(user?.balance ?? 0).toFixed(2)}`)
            return
        }
        setStep('confirm')
    }

    const handleTransfer = async () => {
        setLoading(true)
        try {
            const { data } = await api.post('/wallet/transfer', {
                recipientEmail: form.recipientEmail,
                amount: parseFloat(form.amount),
                note: form.note || undefined,
            })
            toast.success(`₹${parseFloat(form.amount).toFixed(2)} sent to ${data.data.recipient.name}! 🎉`)
            await refreshUser()
            setForm({ recipientEmail: '', amount: '', note: '' })
            setStep('form')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Transfer failed')
        } finally {
            setLoading(false)
        }
    }

    const balance = parseFloat(user?.balance ?? 0)

    return (
        <div className="max-w-lg animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">Send Money</h1>
                <p className="text-gray-400 mt-1">Transfer funds to any PayU user instantly</p>
            </div>

            {/* Balance display */}
            <div className="card mb-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-900/60 rounded-xl flex items-center justify-center text-xl">💳</div>
                <div>
                    <p className="text-sm text-gray-400">Available balance</p>
                    <p className="text-xl font-bold text-white">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(balance)}
                    </p>
                </div>
            </div>

            {step === 'form' ? (
                <div className="card">
                    <form onSubmit={handlePreview} className="space-y-5">
                        <div>
                            <label className="label">Recipient email</label>
                            <input
                                id="recipient-email"
                                type="email"
                                className="input-field"
                                placeholder="recipient@example.com"
                                value={form.recipientEmail}
                                onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                                <input
                                    id="amount"
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    className="input-field pl-8"
                                    placeholder="0.00"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Note (optional)</label>
                            <input
                                id="note"
                                type="text"
                                className="input-field"
                                placeholder="e.g., For dinner last night"
                                maxLength={100}
                                value={form.note}
                                onChange={(e) => setForm({ ...form, note: e.target.value })}
                            />
                        </div>

                        <button id="review-btn" type="submit" className="btn-primary w-full">
                            Review Transfer →
                        </button>
                    </form>
                </div>
            ) : (
                <div className="card space-y-5">
                    <h2 className="text-lg font-semibold text-white">Confirm Transfer</h2>

                    <div className="bg-gray-800/60 rounded-xl divide-y divide-gray-700">
                        {[
                            { label: 'To', value: form.recipientEmail },
                            { label: 'Amount', value: `₹${parseFloat(form.amount).toFixed(2)}` },
                            ...(form.note ? [{ label: 'Note', value: form.note }] : []),
                            { label: 'Remaining balance', value: `₹${(balance - parseFloat(form.amount)).toFixed(2)}` },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between items-center px-4 py-3">
                                <span className="text-gray-400 text-sm">{label}</span>
                                <span className="text-white font-medium text-sm">{value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setStep('form')} className="btn-secondary flex-1">← Back</button>
                        <button
                            id="confirm-transfer-btn"
                            onClick={handleTransfer}
                            className="btn-primary flex-1"
                            disabled={loading}
                        >
                            {loading ? <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                            {loading ? 'Sending...' : 'Confirm & Send'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SendMoney
