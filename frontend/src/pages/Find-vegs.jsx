// FindVegetables.jsx
import React, { useState, useEffect } from 'react';
import './findVegetables.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FindVegetables({ onBack }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [products, setProducts] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState('all');

    const categories = [
        { id: 'all', name: 'All Vegetables', icon: '🌿' },
        { id: 'Sukuma', name: 'Sukuma Wiki', icon: '🥬' },
        { id: 'Spinach', name: 'Spinach', icon: '🌱' },
        { id: 'Cabbage', name: 'Cabbage', icon: '🥬' },
    ];

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 2000); // Wait 500ms after user stops typing

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch products market_produce from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Build URL with filters
                let url = 'http://localhost:8000/api/products/';
                const params = new URLSearchParams();

                if (selectedCategory !== 'all') {
                    params.append('category', selectedCategory);
                }

                if (debouncedSearchTerm) {
                    params.append('search', debouncedSearchTerm);
                }

                if (selectedLocation !== 'all') {
                    params.append('location', selectedLocation);
                }

                const queryString = params.toString();
                if (queryString) {
                    url += `?${queryString}`;
                }

                const response = await axios.get(url);
                console.log(response.data);

                setProducts(response.data.results || []);

                // Extract unique farmers from products
                const productsList = response.data.results || [];
                const uniqueFarmers = [...new Map(
                    productsList.map(product => [product.farmer?.id, {
                        id: product.farmer?.id,
                        name: product.farmer?.name || 'Unknown Farmer',
                        location: product.location,
                        productCount: productsList.filter(p => p.farmer?.id === product.farmer?.id).length,
                        rating: product.farmer?.rating || 4.5
                    }])
                ).values()];

                setFarmers(uniqueFarmers);
                setError(null);
            } catch (err) {
                setError('Failed to load products. Please try again.');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, debouncedSearchTerm, selectedLocation]);

    // Get unique locations from products
    const locations = ['all', ...new Set(products.map(p => p.location).filter(Boolean))];

    // Filter products based on search and category (client-side filtering as backup)
    const filteredProducts = products.filter(product => {
        const matchesSearch = debouncedSearchTerm === '' ||
            (product.name && product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
            (product.farmer && product.farmer.name && product.farmer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
            (product.location && product.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesLocation = selectedLocation === 'all' || product.location === selectedLocation;

        return matchesSearch && matchesCategory && matchesLocation;
    });

    // Cart functions
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, {
                ...product,
                quantity: 1,
                image: product.image
            }];
        });

        // Show mini notification
        alert(`${product.name} added to cart!`);
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Proceeding to checkout...');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        setSelectedCategory('all');
        setSelectedLocation('all');
    };

    if (loading && products.length === 0) {
        return (
            <main className="marketplace">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading fresh vegetables...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="marketplace">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="marketplace">
            {/* Header with Cart */}
            <header className="market-header">
                <div className="container header-container">
                    <div className="header-left">
                        <button
                            className="back-button"
                            onClick={onBack}
                        >
                            ← Back
                        </button>
                        <h1 className="market-title">Vegetable Market</h1>
                    </div>
                    <div className="header-right">
                        <div className="location-selector">
                            <span className="location-icon">📍</span>
                            <select
                                className="location-dropdown"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                {locations.map(location => (
                                    <option key={location} value={location}>
                                        {location === 'all' ? 'All Locations' : location}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="cart-button"
                            onClick={() => setShowCart(!showCart)}
                        >
                            <span className="cart-icon">🛒</span>
                            <span className="cart-count">{cart.length}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Cart Sidebar */}
            {showCart && (
                <div className="cart-sidebar">
                    <div className="cart-header">
                        <h3>Your Cart ({cart.length} items)</h3>
                        <button
                            className="close-cart"
                            onClick={() => setShowCart(false)}
                        >
                            ×
                        </button>
                    </div>
                    <div className="cart-items">
                        {cart.length === 0 ? (
                            <p className="empty-cart">Your cart is empty</p>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={item.image || '/default-product-image.png'}
                                        alt={item.name}
                                        className="cart-item-image"
                                        onError={(e) => {
                                            e.target.src = '/default-product-image.png';
                                        }}
                                    />
                                    <div className="cart-item-details">
                                        <h4>{item.name}</h4>
                                        <p className="cart-item-price">KES {item.price} × {item.quantity}</p>
                                        <div className="cart-item-controls">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="quantity-btn"
                                            >-</button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="quantity-btn"
                                            >+</button>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="remove-btn"
                                            >Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {cart.length > 0 && (
                        <div className="cart-footer">
                            <div className="cart-total">
                                <span>Total:</span>
                                <span>KES {getCartTotal().toFixed(2)}</span>
                            </div>
                            <button
                                className="checkout-button"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Search and Filter Bar */}
            <section className="search-section">
                <div className="container">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search vegetables, farmers, or locations..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                            autoFocus={false}
                        />
                        <button className="search-button">🔍</button>
                    </div>

                    {/* Search indicator - shows when search is active */}
                    {debouncedSearchTerm && (
                        <div className="search-indicator">
                            Searching for: "{debouncedSearchTerm}"
                        </div>
                    )}

                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                <span>{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Marketplace Grid */}
            <section className="marketplace-section">
                <div className="container">
                    <div className="marketplace-header">
                        <h2 className="section-title">
                            {selectedCategory === 'all'
                                ? 'All Fresh Vegetables'
                                : categories.find(c => c.id === selectedCategory)?.name || 'Vegetables'
                            }
                        </h2>
                        <p className="product-count">{filteredProducts.length} products available</p>
                    </div>

                    <div className="marketplace-grid">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="product-card-large">
                                {product.farmer?.rating >= 4.8 && (
                                    <div className="product-badge">
                                        ⭐ Top Rated
                                    </div>
                                )}
                                <div className="product-image-container">
                                    <img
                                        src={product.image || '/default-product-image.png'}
                                        alt={product.name}
                                        className="product-image"
                                        onError={(e) => {
                                            e.target.src = '/default-product-image.png';
                                        }}
                                    />
                                    {!product.available && (
                                        <div className="sold-out">Sold Out</div>
                                    )}
                                </div>

                                <div className="product-details">
                                    <div className="product-header">
                                        <h3 className="product-title">{product.name}</h3>
                                        <span className="product-unit">per {product.unit || 'kg'}</span>
                                    </div>

                                    <div className="product-farmer-info">
                                        <span className="farmer-name">👨‍🌾 {product.farmer?.name || 'Unknown Farmer'}</span>
                                        <span className="farmer-location">📍 {product.location}</span>
                                    </div>

                                    <div className="product-meta">
                                        <div className="product-rating">
                                            <span className="stars">{'⭐'.repeat(Math.floor(product.farmer?.rating || 4))}</span>
                                            <span className="rating-value">{product.farmer?.rating || 4.0}</span>
                                        </div>
                                    </div>

                                    <div className="product-price-section">
                                        <div className="price-container">
                                            <span className="price-label">Price:</span>
                                            <span className="product-price">KES {product.price}</span>
                                        </div>

                                        <div className="product-actions">
                                            <button
                                                className="buy-now-button"
                                                onClick={() => {
                                                    addToCart(product);
                                                }}
                                                disabled={!product.available}
                                            >
                                                Buy Now
                                            </button>
                                            <button
                                                className="add-to-cart-button"
                                                onClick={() => addToCart(product)}
                                                disabled={!product.available}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="no-products">
                            <p>No vegetables found matching your criteria</p>
                            <button
                                className="clear-filters"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Farmers Nearby Section */}
            {farmers.length > 0 && (
                <section className="farmers-section">
                    <div className="container">
                        <h2 className="section-title">Top Farmers Near You</h2>
                        <div className="farmers-grid">
                            {farmers.slice(0, 3).map(farmer => (
                                <div key={farmer.id} className="farmer-card">
                                    <div className="farmer-avatar">
                                        <span className="farmer-avatar-icon">👨‍🌾</span>
                                    </div>
                                    <div className="farmer-info">
                                        <h3>{farmer.name}</h3>
                                        <div className="farmer-rating">
                                            <span className="stars">{'⭐'.repeat(Math.floor(farmer.rating))}</span>
                                            <span>{farmer.rating}</span>
                                        </div>
                                        <p className="farmer-location">{farmer.location}</p>
                                        <p className="farmer-products">{farmer.productCount} products available</p>
                                        <button className="view-farmer-btn">View Farm</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Quick Order Section */}
            <section className="quick-order-section">
                <div className="container">
                    <div className="quick-order-banner">
                        <div className="quick-order-content">
                            <h2>Need Vegetables in a Hurry?</h2>
                            <p>Get express delivery within 2 hours in your area</p>
                            <button className="quick-order-button">Express Order →</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating Action Buttons */}
            <div className="floating-actions">
                <button className="fab-button support-fab">
                    💬
                </button>
                <button className="fab-button cart-fab" onClick={() => setShowCart(true)}>
                    🛒
                    {cart.length > 0 && <span className="fab-badge">{cart.length}</span>}
                </button>
            </div>
        </main>
    );
}

export default FindVegetables;