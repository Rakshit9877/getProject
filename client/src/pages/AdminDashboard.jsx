import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

const statusColors = {
  pending: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  paid: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  pending_verification: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  collaborator_verified: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  review_testing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  refunded: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusLabels = {
  pending: 'Pending',
  paid: 'Paid',
  pending_verification: 'Pending Verification',
  collaborator_verified: 'Collaborator Verified',
  in_progress: 'In Progress',
  review_testing: 'Review & Testing',
  completed: 'Completed',
  refunded: 'Refunded',
}

const allStatuses = ['pending_verification', 'collaborator_verified', 'in_progress', 'review_testing', 'completed', 'refunded']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [statusForm, setStatusForm] = useState({ status: '', message: '' })
  const [statusSuccess, setStatusSuccess] = useState(false)

  // Coupons state
  const [coupons, setCoupons] = useState([])
  const [couponsLoading, setCouponsLoading] = useState(false)
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'percentage', discountValue: '', maxUses: '', expiresAt: '' })

  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      navigate('/admin')
      return
    }
    if (activeTab === 'orders') fetchOrders()
    else fetchCoupons()
  }, [filter, activeTab])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = filter ? { status: filter } : {}
      const res = await axios.get(`${API}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      setOrders(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin')
      }
    }
    setLoading(false)
  }

  const fetchCoupons = async () => {
    setCouponsLoading(true)
    try {
      const res = await axios.get(`${API}/api/admin/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCoupons(res.data)
    } catch (err) {
      console.error('Failed to fetch coupons', err)
    }
    setCouponsLoading(false)
  }

  const updateStatus = async () => {
    if (!statusForm.status) return
    setUpdating(true)
    setStatusSuccess(false)
    try {
      const res = await axios.patch(`${API}/api/admin/orders/${selectedOrder._id}/status`, {
        status: statusForm.status,
        statusMessage: statusForm.message || undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSelectedOrder(res.data.order)
      setStatusSuccess(true)
      fetchOrders()
      setTimeout(() => setStatusSuccess(false), 3000)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    }
    setUpdating(false)
  }

  const createCoupon = async () => {
    try {
      await axios.post(`${API}/api/admin/coupons`, {
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        maxUses: couponForm.maxUses ? Number(couponForm.maxUses) : null,
        expiresAt: couponForm.expiresAt || null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCouponForm({ code: '', discountType: 'percentage', discountValue: '', maxUses: '', expiresAt: '' })
      setShowCouponForm(false)
      fetchCoupons()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon')
    }
  }

  const toggleCoupon = async (id, isActive) => {
    try {
      await axios.patch(`${API}/api/admin/coupons/${id}`, { isActive: !isActive }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchCoupons()
    } catch (err) {
      alert('Failed to update coupon')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  const openOrderDetail = (order) => {
    setSelectedOrder(order)
    setStatusForm({ status: order.status, message: order.statusMessage || '' })
    setStatusSuccess(false)
  }

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="bg-navy-900/50 border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent">
              ProjexLab
            </span>
            <span className="text-navy-500 text-sm hidden sm:inline">/ Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="text-sm text-navy-400 hover:text-white transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-navy-900/50 rounded-xl p-1 w-fit">
          {['orders', 'coupons'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-navy-500 text-white' : 'text-navy-400 hover:text-white'
              }`}
            >
              {tab === 'orders' ? '📦 Orders' : '🎟️ Coupons'}
            </button>
          ))}
        </div>

        {/* ───────── ORDERS TAB ───────── */}
        {activeTab === 'orders' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Orders', value: orders.length, color: 'text-white' },
                { label: 'Pending', value: orders.filter(o => ['pending_verification', 'paid', 'pending'].includes(o.status)).length, color: 'text-blue-400' },
                { label: 'In Progress', value: orders.filter(o => ['in_progress', 'review_testing', 'collaborator_verified'].includes(o.status)).length, color: 'text-amber-400' },
                { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: 'text-emerald-400' },
              ].map(stat => (
                <div key={stat.label} className="glass-card p-4">
                  <p className="text-navy-400 text-xs uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {['', ...allStatuses].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`text-sm px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    filter === status
                      ? 'bg-navy-500 text-white'
                      : 'bg-navy-900/50 text-navy-400 hover:text-white border border-white/5'
                  }`}
                >
                  {status ? statusLabels[status] : 'All Orders'}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            {loading ? (
              <div className="text-center py-20">
                <svg className="animate-spin h-8 w-8 mx-auto text-navy-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p className="text-navy-400 mt-4">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-navy-400 text-lg">No orders found</p>
                <p className="text-navy-500 text-sm mt-1">{filter ? 'Try a different filter' : 'Orders will appear here after payment'}</p>
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider">Name</th>
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Email</th>
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider">Project</th>
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Amount</th>
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr
                          key={order._id}
                          onClick={() => openOrderDetail(order)}
                          className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4 text-navy-300 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                          <td className="py-3 px-4 text-white font-medium">{order.name}</td>
                          <td className="py-3 px-4 text-navy-400 hidden sm:table-cell">{order.email}</td>
                          <td className="py-3 px-4 text-white max-w-[200px] truncate">{order.projectTitle}</td>
                          <td className="py-3 px-4 text-navy-300 hidden md:table-cell">
                            ₹{order.amount?.toLocaleString('en-IN')}
                            {order.discountApplied > 0 && <span className="text-emerald-400 text-xs ml-1">(-₹{order.discountApplied})</span>}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status] || statusColors.pending}`}>
                              {statusLabels[order.status] || order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ───────── COUPONS TAB ───────── */}
        {activeTab === 'coupons' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Coupon Management</h2>
              <button onClick={() => setShowCouponForm(!showCouponForm)} className="btn-primary text-sm">
                {showCouponForm ? 'Cancel' : '+ Create Coupon'}
              </button>
            </div>

            {/* Create Coupon Form */}
            {showCouponForm && (
              <div className="glass-card p-6 mb-6 space-y-4">
                <h3 className="text-sm font-semibold text-navy-400 uppercase tracking-wider">New Coupon</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-navy-500 block mb-1">Code</label>
                    <input
                      type="text"
                      placeholder="e.g. LAUNCH50"
                      value={couponForm.code}
                      onChange={e => setCouponForm(p => ({ ...p, code: e.target.value }))}
                      className="input-field font-mono uppercase text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-navy-500 block mb-1">Discount Type</label>
                    <select
                      value={couponForm.discountType}
                      onChange={e => setCouponForm(p => ({ ...p, discountType: e.target.value }))}
                      className="input-field text-sm"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-navy-500 block mb-1">
                      Discount Value {couponForm.discountType === 'percentage' ? '(%)' : '(₹)'}
                    </label>
                    <input
                      type="number"
                      placeholder={couponForm.discountType === 'percentage' ? 'e.g. 50' : 'e.g. 200'}
                      value={couponForm.discountValue}
                      onChange={e => setCouponForm(p => ({ ...p, discountValue: e.target.value }))}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-navy-500 block mb-1">Max Uses (leave empty for unlimited)</label>
                    <input
                      type="number"
                      placeholder="Unlimited"
                      value={couponForm.maxUses}
                      onChange={e => setCouponForm(p => ({ ...p, maxUses: e.target.value }))}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-navy-500 block mb-1">Expires At (optional)</label>
                    <input
                      type="date"
                      value={couponForm.expiresAt}
                      onChange={e => setCouponForm(p => ({ ...p, expiresAt: e.target.value }))}
                      className="input-field text-sm"
                    />
                  </div>
                </div>
                <button onClick={createCoupon} className="btn-primary text-sm">Create Coupon</button>
              </div>
            )}

            {/* Coupons List */}
            {couponsLoading ? (
              <div className="text-center py-20">
                <p className="text-navy-400">Loading coupons...</p>
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-navy-400 text-lg">No coupons yet</p>
                <p className="text-navy-500 text-sm mt-1">Create your first coupon above</p>
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider">Code</th>
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider">Type</th>
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider">Value</th>
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider">Uses</th>
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Expiry</th>
                        <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider">Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map(c => (
                        <tr key={c._id} className="border-b border-white/5">
                          <td className="py-3 px-4 text-white font-mono font-medium">{c.code}</td>
                          <td className="py-3 px-4 text-navy-300 capitalize">{c.discountType}</td>
                          <td className="py-3 px-4 text-white">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                          <td className="py-3 px-4 text-navy-300">{c.usedCount}{c.maxUses ? `/${c.maxUses}` : '/∞'}</td>
                          <td className="py-3 px-4 text-navy-300 hidden sm:table-cell">{c.expiresAt ? formatDate(c.expiresAt) : 'Never'}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => toggleCoupon(c._id, c.isActive)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${c.isActive ? 'bg-emerald-500' : 'bg-navy-700'}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${c.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ───────── ORDER DETAIL MODAL ───────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-navy-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-navy-900 border-b border-white/10 p-5 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-lg font-semibold">{selectedOrder.projectTitle}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-navy-400 hover:text-white transition-colors p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Update Project Status */}
              <div className="bg-navy-800/50 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Update Project Status</h3>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm(p => ({ ...p, status: e.target.value }))}
                  className="input-field !py-2 text-sm w-full"
                >
                  {allStatuses.map(s => (
                    <option key={s} value={s}>{statusLabels[s]}</option>
                  ))}
                </select>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-navy-500">Status Message (visible to customer)</label>
                    <span className={`text-xs ${statusForm.message.length > 300 ? 'text-red-400' : 'text-navy-600'}`}>{statusForm.message.length}/300</span>
                  </div>
                  <textarea
                    value={statusForm.message}
                    onChange={(e) => setStatusForm(p => ({ ...p, message: e.target.value.slice(0, 300) }))}
                    placeholder="e.g. We've completed the authentication module and are now working on the dashboard."
                    rows={3}
                    className="input-field text-sm w-full resize-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={updateStatus}
                    disabled={updating || !statusForm.status}
                    className="btn-primary text-sm !py-2"
                  >
                    {updating ? 'Sending...' : 'Send Update'}
                  </button>
                  {statusSuccess && (
                    <span className="text-emerald-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Status updated!
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">Customer</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-navy-500 block">Name</span><span className="text-white">{selectedOrder.name}</span></div>
                  <div><span className="text-navy-500 block">Email</span><span className="text-white">{selectedOrder.email}</span></div>
                  <div><span className="text-navy-500 block">University</span><span className="text-white">{selectedOrder.university}</span></div>
                  <div><span className="text-navy-500 block">Year</span><span className="text-white">{selectedOrder.yearOfStudy}</span></div>
                </div>
              </div>

              {/* Project Info */}
              <div>
                <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">Project</h3>
                <div className="space-y-3 text-sm">
                  <div><span className="text-navy-500 block">Description</span><span className="text-white">{selectedOrder.projectDescription}</span></div>
                  {selectedOrder.techStack?.length > 0 && (
                    <div>
                      <span className="text-navy-500 block mb-1">Tech Stack</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedOrder.techStack.map(t => (
                          <span key={t} className="bg-navy-500/20 text-navy-300 text-xs px-2 py-0.5 rounded-lg">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-3">
                    <div><span className="text-navy-500 block">Complexity</span><span className="text-white">{selectedOrder.complexityLevel}</span></div>
                    <div><span className="text-navy-500 block">Features</span><span className="text-white">{selectedOrder.featureCount}</span></div>
                    <div><span className="text-navy-500 block">Deadline</span><span className="text-white">{selectedOrder.deadlinePreference}</span></div>
                  </div>
                  {selectedOrder.featureList && (
                    <div><span className="text-navy-500 block">Feature List</span><span className="text-white whitespace-pre-line">{selectedOrder.featureList}</span></div>
                  )}
                  {selectedOrder.referenceWebsites && (
                    <div><span className="text-navy-500 block">References</span><span className="text-white">{selectedOrder.referenceWebsites}</span></div>
                  )}
                </div>
              </div>

              {/* GitHub & Payment */}
              <div>
                <h3 className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-3">GitHub & Payment</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-navy-500 block">GitHub Repo</span>
                    <a href={selectedOrder.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="text-navy-400 hover:text-navy-300 font-mono text-xs break-all">
                      {selectedOrder.githubRepoUrl}
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><span className="text-navy-500 block">Payment ID</span><span className="text-white font-mono text-xs">{selectedOrder.paymentId || '—'}</span></div>
                    <div>
                      <span className="text-navy-500 block">Amount</span>
                      <span className="text-white font-semibold">₹{selectedOrder.amount?.toLocaleString('en-IN')}</span>
                      {selectedOrder.discountApplied > 0 && (
                        <span className="text-emerald-400 text-xs ml-2">(-₹{selectedOrder.discountApplied} via {selectedOrder.couponCode})</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-navy-500 block">Order Date</span>
                      <span className="text-white">{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-navy-500 block">Order ID</span>
                      <span className="text-white font-mono text-xs">{selectedOrder._id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
