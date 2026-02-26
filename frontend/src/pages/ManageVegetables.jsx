// ManageVegetables.jsx
import React, { useState, useEffect } from 'react';
import './manageVegetables.css';
import axios from 'axios';
// Total Vaue
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function ManageVegetables({ onBack }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Sukuma',
        price: '',
        location: '',
        unit: '',
        available: true,
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalRevenue: 0,
        activeListings: 0,
        soldOut: 0
    });

    // Get token from localStorage
    const getAuthHeader = () => ({
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });

    // Mock farmer ID - in real app, get from auth context
    const farmerId = 1; // This should come from your auth system

    // Fetch farmer's products
    useEffect(() => {
        fetchFarmerProducts();
    }, []);

    const fetchFarmerProducts = async () => {
        try {
            setLoading(true);
            // Use the correct endpoint with authentication
            const response = await axios.get('http://localhost:8000/api/products/', {
                headers: getAuthHeader()
            });

            console.log(response);

            // Filter products for this farmer (mock filtering - in real app, API should filter)
            const farmerProducts = response.data.results ?
                response.data.results.filter(product => product.farmer?.id === farmerId) :
                [];

            setProducts(farmerProducts);
            calculateStats(farmerProducts);
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
                // Token expired or invalid - redirect to login
                localStorage.removeItem('access_token');
                navigate('/login');
            } else {
                setError('Failed to load your products. Please try again.');
            }
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (productsList) => {
        const active = productsList.filter(p => p.available).length;
        const soldOut = productsList.filter(p => !p.available).length;
        const total = productsList.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);

        setStats({
            totalProducts: productsList.length,
            totalRevenue: total,
            activeListings: active,
            soldOut: soldOut
        });
    };

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

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'Sukuma',
            price: '',
            location: '',
            unit: '',
            available: true,
            image: null
        });
        setImagePreview(null);
        setEditingProduct(null);
        setShowAddForm(false);
        setUploadProgress(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('unit', formData.unit);
            formDataToSend.append('available', formData.available);
            formDataToSend.append('farmer', farmerId);

            if (formData.image instanceof File) {
                formDataToSend.append('image', formData.image);
            }

            let response;
            if (editingProduct) {
                // Update existing product - use the correct endpoint
                response = await axios.put(
                    `http://localhost:8000/api/products/${editingProduct.id}/`,
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            ...getAuthHeader()
                        },
                        onUploadProgress: (progressEvent) => {
                            const percent = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setUploadProgress(percent);
                        }
                    }
                );
            } else {
                // Create new product - use the correct endpoint
                response = await axios.post(
                    'http://localhost:8000/api/products/create/',
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            ...getAuthHeader()
                        },
                        onUploadProgress: (progressEvent) => {
                            const percent = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setUploadProgress(percent);
                        }
                    }
                );
            }

            // Refresh products list
            await fetchFarmerProducts();
            resetForm();

            // Show success message
            alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('access_token');
                navigate('/login');
            } else {
                setError(editingProduct ? 'Failed to update product.' : 'Failed to add product.');
            }
            console.error('Error saving product:', err);
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            category: product.category || 'Sukuma',
            price: product.price || '',
            location: product.location || '',
            unit: product.unit || '',
            available: product.available !== false,
            image: null
        });
        setImagePreview(product.image);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            // Use the correct endpoint for delete
            await axios.delete(`http://localhost:8000/api/products/${productId}/`, {
                headers: getAuthHeader()
            });
            await fetchFarmerProducts();
            alert('Product deleted successfully!');
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('access_token');
                navigate('/login');
            } else {
                setError('Failed to delete product.');
            }
            console.error('Error deleting product:', err);
        }
    };

    const toggleAvailability = async (product) => {
        try {
            // Use the correct endpoint for partial update
            await axios.patch(
                `http://localhost:8000/api/products/${product.id}/`,
                { available: !product.available },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );

            await fetchFarmerProducts();
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('access_token');
                navigate('/login');
            } else {
                setError('Failed to update availability.');
            }
            console.error('Error updating availability:', err);
        }
    };

    if (loading && products.length === 0) {
        return (
            <main className="seller-dashboard">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading your products...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="seller-dashboard">
            {/* Header */}
            
            <header className="dashboard-header">
                <div className="container header-container">
                    <div className="header-left">
                        
                        <h1 className="dashboard-title">Farmer Dashboard</h1>
                    </div>
                    <div className="header-right">
                        <div className="farmer-badge">
                            
                            <a href="/">home</a>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="farmer-badge">
                            <span className="farmer-icon">👨‍🌾</span>
                            <span>Your Farm</span>
                        </div>
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
                                <h3>Total Products</h3>
                                <p className="stat-value">{stats.totalProducts}</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <h3>Active Listings</h3>
                                <p className="stat-value">{stats.activeListings}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">❌</div>
                            <div className="stat-content">
                                <h3>Sold Out</h3>
                                <p className="stat-value">{stats.soldOut}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Error Display */}
            {error && (
                <div className="container">
                    <div className="error-message">
                        {error}
                        <button onClick={() => setError(null)} className="close-error">×</button>
                    </div>
                </div>
            )}

            {/* Add Product Button */}
            <section className="action-section">
                <div className="container">
                    <button
                        className="add-product-button"
                        onClick={() => {
                            resetForm();
                            setShowAddForm(!showAddForm);
                        }}
                    >
                        {showAddForm ? '− Cancel' : '+ Add New Product'}
                    </button>
                    <button
                        className="add-product-button"
                        onClick={()=>navigate('/orders')}
                    >
                        see orders
                    </button>
                </div>
            </section>

            {/* Add/Edit Product Form */}
            {showAddForm && (
                <section className="form-section">
                    <div className="container">
                        <div className="product-form-container">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleSubmit} className="product-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="name">Product Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g., Fresh Sukuma Wiki"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category">Category *</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="Sukuma">Sukuma Wiki</option>
                                            <option value="Spinach">Spinach</option>
                                            <option value="Cabbage">Cabbage</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="price">Price (KES) *</label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder="e.g., 50.00"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="unit">Unit *</label>
                                        <input
                                            type="text"
                                            id="unit"
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g., kg, bundle, piece"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="location">Location *</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g., Nairobi, Kiambu"
                                        />
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="available"
                                                checked={formData.available}
                                                onChange={handleInputChange}
                                            />
                                            Available for sale
                                        </label>
                                    </div>

                                    <div className="form-group full-width">
                                        <label htmlFor="image">Product Image</label>
                                        <div className="image-upload-container">
                                            {imagePreview ? (
                                                <div className="image-preview">
                                                    <img src={imagePreview} alt="Preview" />
                                                    <button
                                                        type="button"
                                                        className="remove-image"
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            setFormData(prev => ({ ...prev, image: null }));
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="upload-placeholder">
                                                    <input
                                                        type="file"
                                                        id="image"
                                                        name="image"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="file-input"
                                                    />
                                                    <label htmlFor="image" className="file-label">
                                                        <span className="upload-icon">📸</span>
                                                        <span>Click to upload image</span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="upload-progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${uploadProgress}%` }}
                                        >
                                            {uploadProgress}%
                                        </div>
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={resetForm}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="submit-button"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? (editingProduct ? 'Updating...' : 'Adding...')
                                            : (editingProduct ? 'Update Product' : 'Add Product')
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            )}

            {/* Products List */}
            <section className="products-section">
                <div className="container">
                    <h2 className="section-title">Your Products</h2>

                    {products.length === 0 ? (
                        <div className="no-products">
                            <div className="empty-state">
                                <span className="empty-icon">🌱</span>
                                <h3>No products yet</h3>
                                <p>Start by adding your first vegetable product</p>
                                <button
                                    className="add-first-button"
                                    onClick={() => {
                                        resetForm();
                                        setShowAddForm(true);
                                    }}
                                >
                                    Add Your First Product
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">
                                        <img
                                            src={product.image || '/default-product-image.png'}
                                            alt={product.name}
                                            onError={(e) => {
                                                e.target.src = '/default-product-image.png';
                                            }}
                                        />
                                        {!product.available && (
                                            <div className="status-badge sold-out">Sold Out</div>
                                        )}
                                    </div>

                                    <div className="product-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="product-category">{product.category}</div>

                                        <div className="product-details">
                                            <p className="product-price">
                                                <strong>KES {product.price}</strong> / {product.unit}
                                            </p>
                                            <p className="product-location">📍 {product.location}</p>
                                        </div>

                                        <div className="product-stats">
                                            <span className="stat">
                                                <span className="stat-label">Listed:</span>
                                                <span className="stat-value">
                                                    {new Date(product.created_at || Date.now()).toLocaleDateString()}
                                                </span>
                                            </span>
                                        </div>

                                        <div className="product-actions">
                                            <button
                                                className={`availability-toggle ${product.available ? 'active' : ''}`}
                                                onClick={() => toggleAvailability(product)}
                                            >
                                                {product.available ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(product)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Tips */}
            <section className="tips-section">
                <div className="container">
                    <div className="tips-container">
                        <h3>📝 Tips for Successful Listings</h3>
                        <ul className="tips-list">
                            <li>Add clear, well-lit photos of your vegetables</li>
                            <li>Keep your prices competitive</li>
                            <li>Update availability regularly to avoid disappointed customers</li>
                            <li>Include your specific location for easier delivery</li>
                            <li>Respond quickly to customer inquiries</li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default ManageVegetables;