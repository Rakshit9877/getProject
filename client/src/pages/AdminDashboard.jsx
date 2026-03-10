import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

const statusColors = {
  paid: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  refunded: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusLabels = {
  paid: 'Paid',
  in_progress: 'In Progress',
  completed: 'Completed',
  refunded: 'Refunded',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updating, setUpdating] = useState(false)

  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      navigate('/admin')
      return
    }
    fetchOrders()
  }, [filter])

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

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(true)
    try {
      await axios.patch(`${API}/api/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Refresh orders & detail
      fetchOrders()
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    }
    setUpdating(false)
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

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="bg-navy-900/50 border-b border-white/5 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent">
              ProjectBuildr
            </span>
            <span className="text-navy-500 text-sm hidden sm:inline">/ Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="text-sm text-navy-400 hover:text-white transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, color: 'text-white' },
            { label: 'Paid', value: orders.filter(o => o.status === 'paid').length, color: 'text-blue-400' },
            { label: 'In Progress', value: orders.filter(o => o.status === 'in_progress').length, color: 'text-amber-400' },
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
          {['', 'paid', 'in_progress', 'completed', 'refunded'].map(status => (
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
                    <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Complexity</th>
                    <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-navy-400 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 text-navy-300 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="py-3 px-4 text-white font-medium">{order.name}</td>
                      <td className="py-3 px-4 text-navy-400 hidden sm:table-cell">{order.email}</td>
                      <td className="py-3 px-4 text-white max-w-[200px] truncate">{order.projectTitle}</td>
                      <td className="py-3 px-4 text-navy-300 hidden md:table-cell">{order.complexityLevel}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-navy-500 font-mono text-xs hidden lg:table-cell">{order.paymentId || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
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
              {/* Status Update */}
              <div className="flex items-center gap-3 bg-navy-800/50 rounded-xl p-4">
                <label className="text-sm text-navy-400 whitespace-nowrap">Update Status:</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                  disabled={updating}
                  className="input-field !py-2 text-sm flex-1"
                >
                  <option value="paid">Paid</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="refunded">Refunded</option>
                </select>
                {updating && (
                  <svg className="animate-spin h-4 w-4 text-navy-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                )}
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
                    <div><span className="text-navy-500 block">Amount</span><span className="text-white font-semibold">₹{selectedOrder.amount?.toLocaleString('en-IN')}</span></div>
                  </div>
                  <div>
                    <span className="text-navy-500 block">Order Date</span>
                    <span className="text-white">{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span>
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
