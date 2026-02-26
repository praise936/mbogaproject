// FarmerOrders.jsx
import React, { useState, useEffect } from 'react';
import './farmerOrders.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FarmerOrders({ onBack }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        deliveredToday: 0,
        totalRevenue: 0,
        revenueToday: 0,
        ordersByStatus: {}
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [dateRange, setDateRange] = useState({
        from: '',
        to: ''
    });

    const statuses = [
        { id: 'all', name: 'All Orders', icon: '📦', color: '#666' },
        { id: 'pending', name: 'Pending', icon: '⏳', color: '#f39c12' },
        { id: 'confirmed', name: 'Confirmed', icon: '✅', color: '#3498db' },
        { id: 'processing', name: 'Processing', icon: '⚙️', color: '#9b59b6' },
        { id: 'out_for_delivery', name: 'Out for Delivery', icon: '🚚', color: '#e67e22' },
        { id: 'delivered', name: 'Delivered', icon: '🎉', color: '#27ae60' },
        { id: 'cancelled', name: 'Cancelled', icon: '❌', color: '#e74c3c' },
    ];

    // Fetch orders
    useEffect(() => {
        fetchOrders();
    }, [selectedStatus, dateRange]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Updated URL for orders list
            let url = 'http://localhost:8000/api/orders/';
            const params = new URLSearchParams();

            if (selectedStatus !== 'all') {
                params.append('status', selectedStatus);
            }

            if (dateRange.from) {
                params.append('date_from', dateRange.from);
            }

            if (dateRange.to) {
                params.append('date_to', dateRange.to);
            }

            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            // Check if response.data has a results property (pagination)
            let ordersData;
            if (response.data && Array.isArray(response.data)) {
                ordersData = response.data;
            } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
                ordersData = response.data.results;
            } else {
                ordersData = [];
            }

            setOrders(ordersData);
            console.log(ordersData);

            filterOrders(ordersData, searchTerm);

            // Fetch stats
            fetchStats();

        } catch (err) {
            setError('Failed to load orders. Please try again.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Updated URL for order stats
            const response = await axios.get('http://localhost:8000/api/orders/stats/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setStats(response.data);
            console.log(response.data);

        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const filterOrders = (ordersList, search) => {
        if (!search.trim()) {
            setFilteredOrders(ordersList);
            return;
        }

        const filtered = ordersList.filter(order =>
            order.order_id.toLowerCase().includes(search.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
            order.customer_phone.includes(search) ||
            order.delivery_address.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredOrders(filtered);
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        filterOrders(orders, term);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Updated URL for status update
            await axios.patch(
                `http://localhost:8000/api/orders/${orderId}/update-status/`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );

            // Refresh orders
            fetchOrders();

            // Show success message
            alert(`Order status updated to ${newStatus}`);
        } catch (err) {
            alert('Failed to update order status');
            console.error('Error updating status:', err);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                // Updated URL for order deletion
                await axios.delete(`http://localhost:8000/api/orders/${orderId}/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                // Refresh orders
                fetchOrders();
                alert('Order deleted successfully');
            } catch (err) {
                alert('Failed to delete order');
                console.error('Error deleting order:', err);
            }
        }
    };

    const handleMarkDelivered = async (orderId) => {
        try {
            // Updated URL for status update
            await axios.patch(
                `http://localhost:8000/api/orders/${orderId}/update-status/`,
                { status: 'delivered' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );

            fetchOrders();
            alert('Order marked as delivered! 🎉');
        } catch (err) {
            alert('Failed to mark order as delivered');
        }
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const getStatusColor = (status) => {
        const statusMap = {
            'pending': '#f39c12',
            'confirmed': '#3498db',
            'processing': '#9b59b6',
            'out_for_delivery': '#e67e22',
            'delivered': '#27ae60',
            'cancelled': '#e74c3c'
        };
        return statusMap[status] || '#666';
    };

    const getStatusIcon = (status) => {
        const statusMap = {
            'pending': '⏳',
            'confirmed': '✅',
            'processing': '⚙️',
            'out_for_delivery': '🚚',
            'delivered': '🎉',
            'cancelled': '❌'
        };
        return statusMap[status] || '📦';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && orders.length === 0) {
        return (
            <main className="farmer-orders">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="farmer-orders">
            {/* Header */}
            <header className="orders-header">
                <div className="container header-container">
                    <div className="header-left">
                        <button className="back-button" onClick={onBack}>
                            ← Back
                        </button>
                        <h1 className="page-title">Farmer Orders Dashboard</h1>
                    </div>
                    <div className="header-right">
                        <button
                            className="refresh-button"
                            onClick={fetchOrders}
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📦</div>
                            <div className="stat-content">
                                <span className="stat-label">Total Orders</span>
                                <span className="stat-value">{stats.totalOrders}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⏳</div>
                            <div className="stat-content">
                                <span className="stat-label">Pending</span>
                                <span className="stat-value">{stats.pendingOrders}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">💰</div>
                            <div className="stat-content">
                                <span className="stat-label">Total Revenue</span>
                                <span className="stat-value">KES {stats.totalRevenue?.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🎉</div>
                            <div className="stat-content">
                                <span className="stat-label">Delivered Today</span>
                                <span className="stat-value">{stats.deliveredToday}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="filters-section">
                <div className="container">
                    <div className="filters-container">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search by order ID, customer, phone..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                            <span className="search-icon">🔍</span>
                        </div>

                        <div className="date-filters">
                            <input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                className="date-input"
                                placeholder="From"
                            />
                            <span className="date-separator">to</span>
                            <input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                className="date-input"
                                placeholder="To"
                            />
                        </div>
                    </div>

                    {/* Status Tabs */}
                    <div className="status-tabs">
                        {statuses.map(status => (
                            <button
                                key={status.id}
                                className={`status-tab ${selectedStatus === status.id ? 'active' : ''}`}
                                onClick={() => setSelectedStatus(status.id)}
                                style={{ '--status-color': status.color }}
                            >
                                <span className="status-icon">{status.icon}</span>
                                <span className="status-name">{status.name}</span>
                                {status.id !== 'all' && (
                                    <span className="status-count">
                                        {stats.ordersByStatus?.[status.id] || 0}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Orders List */}
            <section className="orders-section">
                <div className="container">
                    {filteredOrders.length === 0 ? (
                        <div className="no-orders">
                            <div className="no-orders-icon">📭</div>
                            <h3>No orders found</h3>
                            <p>There are no orders matching your criteria</p>
                            <button
                                className="clear-filters-btn"
                                onClick={() => {
                                    setSelectedStatus('all');
                                    setSearchTerm('');
                                    setDateRange({ from: '', to: '' });
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {filteredOrders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div className="order-id-section">
                                            <span className="order-id">{order.order_id}</span>
                                            <span
                                                className="order-status-badge"
                                                style={{
                                                    backgroundColor: getStatusColor(order.status),
                                                    color: 'white'
                                                }}
                                            >
                                                {getStatusIcon(order.status)} {order.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="order-time">
                                            {formatDate(order.created_at)}
                                        </div>
                                    </div>

                                    <div className="order-body">
                                        <div className="customer-info">
                                            <div className="info-row">
                                                <span className="info-label">👤 Customer:</span>
                                                <span className="info-value">{order.customer_name}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">📞 Phone:</span>
                                                <span className="info-value">{order.customer_phone}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">📍 Address:</span>
                                                <span className="info-value">{order.delivery_address}</span>
                                            </div>
                                        </div>

                                        <div className="order-items-preview">
                                            <h4>Order Items:</h4>
                                            <div className="items-list">
                                                {order.items?.slice(0, 2).map((item, index) => (
                                                    <div key={index} className="item-preview">
                                                        <span>{item.quantity} {item.unit} {item.product_name}</span>
                                                    </div>
                                                ))}
                                                {order.items?.length > 2 && (
                                                    <div className="more-items">
                                                        +{order.items.length - 2} more items
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="order-total">
                                            <span className="total-label">Total Amount:</span>
                                            <span className="total-value">KES {order.total_amount?.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="order-footer">
                                        <div className="payment-status">
                                            <span className="payment-label">Payment:</span>
                                            <span className={`payment-badge ${order.payment_status}`}>
                                                {order.payment_status}
                                            </span>
                                        </div>

                                        <div className="order-actions">
                                            <button
                                                className="action-btn view-btn"
                                                onClick={() => viewOrderDetails(order)}
                                            >
                                                👁️ View
                                            </button>

                                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                <>
                                                    <select
                                                        className="status-select"
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    >
                                                        <option value="confirmed">Confirm</option>
                                                        <option value="processing">Process</option>
                                                        <option value="out_for_delivery">Out for Delivery</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancel</option>
                                                    </select>

                                                    {order.status === 'out_for_delivery' && (
                                                        <button
                                                            className="action-btn deliver-btn"
                                                            onClick={() => handleMarkDelivered(order.id)}
                                                        >
                                                            ✅ Mark Delivered
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            {order.status === 'delivered' && (
                                                <span className="delivered-badge">
                                                    ✅ Delivered {order.delivered_at ? formatDate(order.delivered_at) : ''}
                                                </span>
                                            )}

                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDeleteOrder(order.id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowOrderDetails(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Order Details - {selectedOrder.order_id}</h2>
                            <button className="close-modal" onClick={() => setShowOrderDetails(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-section">
                                <h3>Customer Information</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>Name:</label>
                                        <span>{selectedOrder.customer_name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Phone:</label>
                                        <span>{selectedOrder.customer_phone}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Email:</label>
                                        <span>{selectedOrder.customer_email || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item full-width">
                                        <label>Delivery Address:</label>
                                        <span>{selectedOrder.delivery_address}</span>
                                    </div>
                                    {selectedOrder.delivery_notes && (
                                        <div className="detail-item full-width">
                                            <label>Delivery Notes:</label>
                                            <span>{selectedOrder.delivery_notes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Order Items</h3>
                                <table className="items-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Unit</th>
                                            <th>Price/Unit</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.product_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.unit}</td>
                                                <td>KES {item.price_per_unit}</td>
                                                <td>KES {item.subtotal?.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="4" className="total-label">Subtotal:</td>
                                            <td>KES {selectedOrder.subtotal?.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4" className="total-label">Delivery Fee:</td>
                                            <td>KES {selectedOrder.delivery_fee?.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4" className="total-label grand-total">Total:</td>
                                            <td className="grand-total">KES {selectedOrder.total_amount?.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="detail-section">
                                <h3>Order Status</h3>
                                <div className="status-timeline">
                                    <div className="timeline-item">
                                        <span className="timeline-label">Order Placed:</span>
                                        <span className="timeline-value">{formatDate(selectedOrder.created_at)}</span>
                                    </div>
                                    <div className="timeline-item">
                                        <span className="timeline-label">Current Status:</span>
                                        <span
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                                        >
                                            {selectedOrder.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    {selectedOrder.delivered_at && (
                                        <div className="timeline-item">
                                            <span className="timeline-label">Delivered:</span>
                                            <span className="timeline-value">{formatDate(selectedOrder.delivered_at)}</span>
                                        </div>
                                    )}
                                    {selectedOrder.estimated_delivery_time && (
                                        <div className="timeline-item">
                                            <span className="timeline-label">Estimated Delivery:</span>
                                            <span className="timeline-value">{formatDate(selectedOrder.estimated_delivery_time)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="modal-btn close-btn"
                                onClick={() => setShowOrderDetails(false)}
                            >
                                Close
                            </button>
                            {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                                <button
                                    className="modal-btn update-btn"
                                    onClick={() => {
                                        setShowOrderDetails(false);
                                        handleStatusChange(selectedOrder.id, 'delivered');
                                    }}
                                >
                                    Mark as Delivered
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default FarmerOrders;