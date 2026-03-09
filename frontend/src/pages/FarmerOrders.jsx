import React, { useState, useEffect, useCallback, useMemo } from 'react';
import publicApi from '../services/publicApi';
import './farmerOrders.css';

// Constants
const ORDER_STATUSES = {
    ALL: 'all',
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

const STATUS_CONFIG = [
    { id: ORDER_STATUSES.ALL, label: 'All Orders', icon: '📋', color: '#64748b' },
    { id: ORDER_STATUSES.PENDING, label: 'Pending', icon: '⏳', color: '#f59e0b' },
    { id: ORDER_STATUSES.CONFIRMED, label: 'Confirmed', icon: '✅', color: '#3b82f6' },
    { id: ORDER_STATUSES.PROCESSING, label: 'Processing', icon: '⚙️', color: '#8b5cf6' },
    { id: ORDER_STATUSES.OUT_FOR_DELIVERY, label: 'Out for Delivery', icon: '🚚', color: '#f97316' },
    { id: ORDER_STATUSES.DELIVERED, label: 'Delivered', icon: '🎉', color: '#10b981' },
    { id: ORDER_STATUSES.CANCELLED, label: 'Cancelled', icon: '❌', color: '#ef4444' }
];

// Utility Functions
const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0.00';
    const num = typeof amount === 'number' ? amount : Number(amount);
    return isNaN(num) ? '0.00' : num.toFixed(2);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Stats Card Component
const StatsCard = ({ title, value, icon, trend, color }) => (
    <div className="stats-card">
        <div className="stats-card-content">
            <div className="stats-card-left">
                <span className="stats-card-title">{title}</span>
                <span className="stats-card-value">{value}</span>
                {trend && <span className="stats-card-trend">{trend}</span>}
            </div>
            <div className="stats-card-icon" style={{ backgroundColor: `${color}15`, color }}>
                {icon}
            </div>
        </div>
    </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG.find(s => s.id === status) || STATUS_CONFIG[0];
    return (
        <span className="status-badge" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
            <span className="status-badge-icon">{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
};

// Order Card Component
const OrderCard = ({ order, onViewDetails, onStatusUpdate }) => {
    const canUpdate = !['delivered', 'cancelled'].includes(order.status);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="order-card">
            {/* Card Header */}
            <div className="order-card-header">
                <div className="order-header-left">
                    <h3 className="order-number">#{order.order_number}</h3>
                    <StatusBadge status={order.status} />
                </div>
                <span className="order-date">{formatDateShort(order.created_at)}</span>
            </div>

            {/* Customer Info Row */}
            <div className="customer-info-row">
                <div className="customer-info-item">
                    <span className="info-icon">👤</span>
                    <span>{order.customer_name}</span>
                </div>
                <div className="customer-info-item">
                    <span className="info-icon">📞</span>
                    <span>{order.customer_phone}</span>
                </div>
                <div className="customer-info-item address">
                    <span className="info-icon">📍</span>
                    <span className="address-text">{order.delivery_address}</span>
                </div>
            </div>

            {/* Products Preview */}
            <div className="products-preview">
                {order.items?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="preview-product">
                        <div className="preview-product-image">
                            
                            {item.product_image ? (
                                <img
                                    src={item.product_image_url}
                                    alt={item.product_name}
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            ) : (
                                <div className="preview-image-placeholder">📦</div>
                            )}
                        </div>
                        <div className="preview-product-details">
                            <span className="preview-product-name">{item.product_name}</span>
                            <span className="preview-product-meta">
                                {item.quantity} {item.unit} × KES {formatCurrency(item.price_per_unit)}
                            </span>
                        </div>
                    </div>
                ))}
                {(order.items?.length || 0) > 3 && (
                    <div className="more-products">+{order.items.length - 3} more items</div>
                )}
            </div>

            {/* Card Footer */}
            <div className="order-card-footer">
                <div className="order-total">
                    <span>Total Amount</span>
                    <strong>KES {formatCurrency(order.total_amount)}</strong>
                </div>

                <div className="order-actions">
                    <button
                        className="btn-view"
                        onClick={() => onViewDetails(order)}
                    >
                        View Details
                    </button>

                    {canUpdate && (
                        <select
                            className="status-select"
                            value={order.status}
                            onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                        >
                            <option value="confirmed">✓ Confirm</option>
                            <option value="processing">⚙️ Process</option>
                            <option value="out_for_delivery">🚚 Out for Delivery</option>
                            <option value="delivered">🎉 Delivered</option>
                            <option value="cancelled">❌ Cancel</option>
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose, onStatusUpdate }) => {
    if (!order) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header">
                    <div>
                        <h2>Order #{order.order_number}</h2>
                        <div className="modal-header-status">
                            <StatusBadge status={order.status} />
                            <span className="modal-date">Placed on {formatDate(order.created_at)}</span>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    {/* Customer Info Section */}
                    <div className="customer-info-section">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Customer</span>
                                <span className="info-value">{order.customer_name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{order.customer_phone}</span>
                            </div>
                            <div className="info-item full-width">
                                <span className="info-label">Delivery Address</span>
                                <span className="info-value">{order.delivery_address}</span>
                            </div>
                            {order.delivery_instructions && (
                                <div className="info-item full-width">
                                    <span className="info-label">Instructions</span>
                                    <span className="info-value">{order.delivery_instructions}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="products-section">
                        <h3>Order Items</h3>
                        <div className="products-grid">
                            {order.items?.map(item => (
                                <div key={item.id} className="product-item">
                                    <div className="product-image-wrapper">
                                        {item.product_image ? (
                                            <img
                                                src={item.product_image_url}
                                                alt={item.product_name}
                                                className="product-image"
                                            />
                                        ) : (
                                            <div className="product-image-placeholder">
                                                <span>📦</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-details">
                                        <h4 className="product-name">{item.product_name}</h4>
                                        <div className="product-price-info">
                                            <span className="product-quantity">
                                                {item.quantity} {item.unit}
                                            </span>
                                            <span className="product-price">
                                                KES {formatCurrency(item.price_per_unit)}/{item.unit}
                                            </span>
                                        </div>
                                        <div className="product-subtotal">
                                            <span>Subtotal:</span>
                                            <strong>KES {formatCurrency(item.subtotal)}</strong>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary-section">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>KES {formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>KES {formatCurrency(order.delivery_fee)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total Amount</span>
                            <span className="total-amount">KES {formatCurrency(order.total_amount)}</span>
                        </div>
                    </div>

                    {/* Timeline */}
                    {order.timeline && (
                        <div className="timeline-section">
                            <h3>Order Timeline</h3>
                            <div className="timeline">
                                {Object.entries(order.timeline).map(([key, value]) => {
                                    if (!value) return null;
                                    const status = STATUS_CONFIG.find(s => s.id === key);
                                    return (
                                        <div key={key} className="timeline-item">
                                            <div className="timeline-icon" style={{ color: status?.color }}>
                                                {status?.icon}
                                            </div>
                                            <div className="timeline-content">
                                                <span className="timeline-label">{status?.label || key}</span>
                                                <span className="timeline-date">{formatDateShort(value)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                    <button className="btn-outline" onClick={onClose}>
                        Close
                    </button>

                    {!['delivered', 'cancelled'].includes(order.status) && (
                        <button
                            className="btn-primary"
                            onClick={() => {
                                onStatusUpdate(order.id, ORDER_STATUSES.DELIVERED);
                                onClose();
                            }}
                        >
                            Mark as Delivered
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Component
const FarmerOrders = ({ onBack }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        status: ORDER_STATUSES.ALL,
        search: '',
        dateRange: 'today'
    });

    // Create filtered orders based on search and status
    const filteredOrders = useMemo(() => {
        let filtered = [...orders];

        // Filter by status (if not ALL)
        if (filters.status !== ORDER_STATUSES.ALL) {
            filtered = filtered.filter(order => order.status === filters.status);
        }

        // Filter by search term
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(order =>
                order.order_number?.toLowerCase().includes(searchLower) ||
                order.customer_name?.toLowerCase().includes(searchLower) ||
                order.customer_phone?.toLowerCase().includes(searchLower) ||
                order.delivery_address?.toLowerCase().includes(searchLower)
            );
        }

        // Filter by date range (client-side filtering as fallback)
        if (filters.dateRange !== 'all' && filters.dateRange !== 'today') {
            // This is just a fallback - ideally the API handles date filtering
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            filtered = filtered.filter(order => {
                const orderDate = new Date(order.created_at);
                if (filters.dateRange === 'today') {
                    return orderDate >= today;
                }
                // Add more date range logic if needed
                return true;
            });
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return filtered;
    }, [orders, filters.status, filters.search, filters.dateRange]);

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                ...(filters.status !== ORDER_STATUSES.ALL && { status: filters.status }),
                ...(filters.search && { search: filters.search }),
                ...(filters.dateRange !== 'all' && { date_range: filters.dateRange })
            };

            const response = await publicApi.get('orders/', { params });
            console.log(response.data);
            
            const ordersData = response.data.results || response.data || [];
            setOrders(ordersData);
            
            
            setError(null);
        } catch (err) {
            setError('Failed to load orders. Please try again.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    }, [filters.status, filters.search, filters.dateRange]);

    // Fetch stats
    const fetchStats = useCallback(async () => {
        try {
            const response = await publicApi.get('orders/stats/');
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, [fetchOrders, fetchStats]);

    // Handle status update
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await publicApi.patch(`orders/${orderId}/update-status/`, { status: newStatus });
            await Promise.all([fetchOrders(), fetchStats()]);
        } catch (err) {
            alert('Failed to update order status. Please try again.');
        }
    };

    // Handle view details
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    // Handle filter change
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            status: ORDER_STATUSES.ALL,
            search: '',
            dateRange: 'today'
        });
    };

    // Stats cards data
    const statsCards = useMemo(() => {
        if (!stats) return [];
        return [
            { title: 'Total Orders', value: stats.totalOrders || 0, icon: '📊', color: '#64748b' },
            { title: 'Pending', value: stats.pendingOrders || 0, icon: '⏳', color: '#f59e0b' },
            { title: 'Processing', value: stats.processingOrders || 0, icon: '⚙️', color: '#8b5cf6' },
            { title: 'Delivered Today', value: stats.deliveredToday || 0, icon: '🎉', color: '#10b981' },
            { title: 'Revenue Today', value: `KES ${formatCurrency(stats.revenueToday)}`, icon: '💰', color: '#3b82f6' },
            { title: 'Total Revenue', value: `KES ${formatCurrency(stats.totalRevenue)}`, icon: '📈', color: '#64748b' }
        ];
    }, [stats]);

    if (loading && orders.length === 0) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="farmer-orders">
            {/* Header */}
            <header className="orders-header">
                <div className="header-left">
                    <button className="back-button" onClick={onBack}>
                        ← Back
                    </button>
                    <h1>Orders</h1>
                </div>
                <button className="refresh-button" onClick={fetchOrders}>
                    ↻ Refresh
                </button>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button onClick={fetchOrders}>Retry</button>
                </div>
            )}

            {/* Stats Grid */}
            {stats && (
                <div className="stats-grid">
                    {statsCards.map((stat, index) => (
                        <StatsCard key={index} {...stat} />
                    ))}
                </div>
            )}

            {/* Filters Bar */}
            <div className="filters-bar">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search orders, customers..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="search-input"
                    />
                </div>

                <select
                    className="date-filter"
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="all">All Time</option>
                </select>
            </div>

            {/* Status Tabs */}
            <div className="status-tabs">
                {STATUS_CONFIG.map(status => (
                    <button
                        key={status.id}
                        className={`status-tab ${filters.status === status.id ? 'active' : ''}`}
                        onClick={() => handleFilterChange('status', status.id)}
                    >
                        <span className="status-tab-icon">{status.icon}</span>
                        <span className="status-tab-label">{status.label}</span>
                        {stats?.ordersByStatus?.[status.id] > 0 && (
                            <span className="status-tab-count">{stats.ordersByStatus[status.id]}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders Grid */}
            <div className="orders-grid">
                {filteredOrders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No orders found</h3>
                        <p>Try adjusting your filters</p>
                        <button className="btn-outline" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onViewDetails={handleViewDetails}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    ))
                )}
            </div>

            {/* Order Details Modal */}
            {showModal && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setShowModal(false)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    );
};

export default FarmerOrders;