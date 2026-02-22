// FarmerProducts.jsx
import { useState, useEffect } from 'react';
import './FarmerProducts.css';

const FarmerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFarmerProducts();
    }, []);

    const fetchFarmerProducts = async () => {
        try {
            setLoading(true);
            // Assuming your Django backend endpoint for farmer's products
            const response = await fetch('http://127.0.0.1:8000/api/products/my-products/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data.results);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">Error: {error}</p>
                <button onClick={fetchFarmerProducts} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="farmer-products">
            <div className="products-header">
                <h2>My Products</h2>
                <p className="product-count">{products.length} products listed</p>
            </div>

            {products.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't listed any products yet.</p>
                    <button className="add-product-button">Add Your First Product</button>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="product-image-placeholder">
                                        <span>No Image</span>
                                    </div>
                                )}
                                <span className={`product-status ${product.available ? 'available' : 'unavailable'}`}>
                                    {product.available ? 'Available' : 'Sold Out'}
                                </span>
                            </div>

                            <div className="product-details">
                                <h3 className="product-name">{product.name}</h3>

                                <div className="product-category">
                                    <span className="category-badge">{product.category}</span>
                                </div>

                                <div className="product-info">
                                    <div className="info-item">
                                        <span className="info-label">Location:</span>
                                        <span className="info-value">{product.location}</span>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">Unit:</span>
                                        <span className="info-value">{product.unit}</span>
                                    </div>
                                </div>

                                <div className="product-price">
                                    <span className="price-label">Price:</span>
                                    <span className="price-value">
                                        KES {parseFloat(product.price).toLocaleString()}
                                    </span>
                                </div>

                                <div className="product-actions">
                                    <button className="edit-button">
                                        <span className="button-icon">✎</span>
                                        Edit
                                    </button>
                                    <button className="delete-button">
                                        <span className="button-icon">🗑</span>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FarmerProducts;