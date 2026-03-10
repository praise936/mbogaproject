// ManageVegetables.jsx Back
import React, { useState, useEffect } from 'react';
import './manageVegetables.css';
import publicApi from '../services/publicApi';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function ManageVegetables() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Sukuma',
        price: '',
        location: '',
        unit: 'bundle',
        available: true,
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    // Get auth header
    const getAuthHeader = () => ({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });

    // Fetch current user
    const fetchCurrentUser = async () => {
        try {
            const response = await api.get('profile/')
                
        
            setCurrentUser(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('access_token');
                navigate('/login');
            }
        }
    };

    // Fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await publicApi.get('products/my/', {
                
            });
            setProducts(response.data.results || response.data || []);
            console.log(response.data);
            
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('access_token');
                navigate('/login');
            } else {
                setError('Failed to load products');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchCurrentUser();
            await fetchProducts();
        };
        init();
    }, []);

    // Stats calculation mv-product-image
    const stats = {
        total: products.length,
        active: products.filter(p => p.is_available).length,
        soldOut: products.filter(p => !p.is_available).length
    };

    const filteredProducts = products.filter(product => {
        if (activeTab === 'active') return product.is_available;
        if (activeTab === 'sold') return !product.is_available;
        return true;
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Sukuma',
            price: '',
            location: '',
            unit: 'bundle',
            available: true,
            image: null
        });
        setImagePreview(null);
        setEditingProduct(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'image' && formData.image instanceof File) {
                    formDataToSend.append('image', formData.image);
                } else if (key === 'available') {
                    formDataToSend.append('is_available', formData.available);
                } else if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });
            formDataToSend.append('quantity_available', 10);

            if (editingProduct) {
                await publicApi.put(
                    `products/${editingProduct.id}/update/`,
                    formDataToSend)
                    
                
            } else {
                await publicApi.post(
                    'products/create/',
                    formDataToSend)
                   
                
            }

            await fetchProducts();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await publicApi.delete(`products/${productId}/delete/`)            
          
            await fetchProducts();
        } catch (err) {
            setError('Failed to delete product');
        }
    };

    const toggleAvailability = async (product) => {
        try {
            await publicApi.patch(
                `products/${product.id}/update/`,
                { is_available: !product.is_available },
                
            );
            await fetchProducts();
        } catch (err) {
            setError('Failed to update availability');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            location: product.location,
            unit: product.unit,
            available: product.is_available,
            image: null
        });
        setImagePreview(product.image_url);
        setShowForm(true);
    };

    if (loading) {
        return (
            <div className="mv-loading">
                <div className="mv-spinner"></div>
            </div>
        );
    }

    return (
        <div className="mv-container">
            {/* Header */}
            <header className="mv-header">
                <div className="mv-header-content">
                    <h1 className="mv-title">Farm Dashboard</h1>
                    <div className="mv-user">
                        <span className="mv-user-name">{currentUser?.name || 'Farmer'}</span>
                        <button
                            className="mv-icon-btn"
                            onClick={() => navigate('/orders')}
                        >
                            📦
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="mv-stats">
                <div className="mv-stat-card">
                    <div className="mv-stat-icon">📋</div>
                    <div>
                        <div className="mv-stat-label">Total</div>
                        <div className="mv-stat-value">{stats.total}</div>
                    </div>
                </div>
                <div className="mv-stat-card">
                    <div className="mv-stat-icon">✅</div>
                    <div>
                        <div className="mv-stat-label">Active</div>
                        <div className="mv-stat-value">{stats.active}</div>
                    </div>
                </div>
                <div className="mv-stat-card">
                    <div className="mv-stat-icon">❌</div>
                    <div>
                        <div className="mv-stat-label">Sold Out</div>
                        <div className="mv-stat-value">{stats.soldOut}</div>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="mv-action">
                <button
                    className="mv-add-btn"
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                >
                    {showForm ? '✕ Cancel' : '+ Add Product'}
                </button>
                <button
                    className="mv-add-btn"
                    onClick={() => {
                        navigate('/orders')
                    }}
                >
                    see orders
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="mv-error">
                    {error}
                    <button onClick={() => setError(null)} className="mv-error-close">✕</button>
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div className="mv-form-card">
                    <h2 className="mv-form-title">
                        {editingProduct ? 'Edit Product' : 'New Product'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mv-form-group">
                            <label className="mv-form-label">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mv-form-input"
                                placeholder="e.g., Fresh Sukuma"
                                required
                            />
                        </div>

                        <div className="mv-form-row">
                            <div className="mv-form-group">
                                <label className="mv-form-label">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="mv-form-select"
                                >
                                    <option value="Sukuma">Sukuma</option>
                                    <option value="Spinach">Spinach</option>
                                    <option value="Cabbage">Cabbage</option>
                                    <option value="Kale">Kale</option>
                                </select>
                            </div>

                            <div className="mv-form-group">
                                <label className="mv-form-label">Unit</label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                    className="mv-form-select"
                                >
                                    <option value="bundle">Bundle</option>
                                    <option value="kg">Kg</option>
                                    <option value="piece">Piece</option>
                                </select>
                            </div>
                        </div>

                        <div className="mv-form-row">
                            <div className="mv-form-group">
                                <label className="mv-form-label">Price (KES)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="mv-form-input"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="mv-form-group">
                                <label className="mv-form-label">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="mv-form-input"
                                    placeholder="e.g., Nairobi"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mv-form-group">
                            <label className="mv-form-label">Product Image</label>
                            <div className="mv-image-upload">
                                {imagePreview ? (
                                    <div className="mv-image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                        <button
                                            type="button"
                                            className="mv-image-remove"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setFormData(prev => ({ ...prev, image: null }));
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <label className="mv-upload-label">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="mv-file-input"
                                        />
                                        <div className="mv-upload-placeholder">
                                            <span className="mv-upload-icon">📸</span>
                                            <span>Tap to upload</span>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        <label className="mv-checkbox">
                            <input
                                type="checkbox"
                                name="available"
                                checked={formData.available}
                                onChange={handleInputChange}
                            />
                            <span>Available for sale</span>
                        </label>

                        <div className="mv-form-actions">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="mv-btn mv-btn-secondary"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="mv-btn mv-btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : (editingProduct ? 'Update' : 'Save')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabs */}
            {products.length > 0 && (
                <div className="mv-tabs">
                    <button
                        className={`mv-tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All ({stats.total})
                    </button>
                    <button
                        className={`mv-tab ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Active ({stats.active})
                    </button>
                    <button
                        className={`mv-tab ${activeTab === 'sold' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sold')}
                    >
                        Sold Out ({stats.soldOut})
                    </button>
                </div>
            )}

            {/* Products List */}
            <div className="mv-products">
                {filteredProducts.length === 0 ? (
                    <div className="mv-empty">
                        <div className="mv-empty-icon">🌱</div>
                        <h3 className="mv-empty-title">No products yet</h3>
                        <p className="mv-empty-text">Start by adding your first vegetable</p>
                        <button
                            className="mv-empty-btn"
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                        >
                            Add Product
                        </button>
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product.id} className="mv-product-card">
                            <div className="mv-product-image">
                                <img
                                    src={product.image_url || '/default-product.png'}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = '/default-product.png';
                                    }}
                                />
                                {!product.is_available && (
                                    <span className="mv-badge mv-badge-sold">Sold Out</span>
                                )}
                            </div>

                            <div className="mv-product-content">
                                <div className="mv-product-header">
                                    <div>
                                        <h3 className="mv-product-name">{product.name}</h3>
                                        <span className="mv-product-category">{product.category}</span>
                                    </div>
                                    <span className="mv-product-price">KES {product.price}</span>
                                </div>

                                <div className="mv-product-meta">
                                    <span className="mv-meta-item">📍 {product.location}</span>
                                    <span className="mv-meta-item">📦 per {product.unit}</span>
                                </div>

                                <div className="mv-product-footer">
                                    <button
                                        className={`mv-status-btn ${product.is_available ? 'active' : ''}`}
                                        onClick={() => toggleAvailability(product)}
                                    >
                                        {product.is_available ? 'In Stock' : 'Out of Stock'}
                                    </button>
                                    <div className="mv-product-actions">
                                        <button
                                            className="mv-action-btn edit"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="mv-action-btn delete"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ManageVegetables;