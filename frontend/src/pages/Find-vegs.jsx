// FindVegetables.jsx
import React, { useState } from 'react';
import './findVegetables.css';
import sukumaImage from '../assets/fresh-sukuma.png';
// import { useNavigate } from 'react-router-dom';

function FindVegetables( { onBack}) {
    // const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    // Expanded product database
    const products = [
        {
            id: 1,
            name: 'Fresh Sukuma',
            price: 50,
            farmer: 'Dorcas Agwenge',
            location: 'kesses',
            rating: 4.8,
            orders: 234,
            category: 'kales',
            image: sukumaImage,
            unit: 'bundle',
            minOrder: 5,
            available: true,
            description: 'Crispy, fresh sukuma wiki harvested this morning'
        },
        {
            id: 2,
            name: 'Organic Sukuma',
            price: 60,
            farmer: 'kelly',
            location: 'chebarus',
            rating: 4.9,
            orders: 189,
            category: 'kales',
            image: sukumaImage,
            unit: 'bundle',
            minOrder: 3,
            available: true,
            description: 'Certified organic sukuma, no pesticides'
        },
        {
            id: 3,
            name: 'Premium Sukuma',
            price: 45,
            farmer: 'Peter praise',
            location: 'mabs',
            rating: 4.7,
            orders: 312,
            category: 'kales',
            image: sukumaImage,
            unit: 'bundle',
            minOrder: 4,
            available: true,
            description: 'Large leaf sukuma, perfect for daily sales'
        },
        {
            id: 4,
            name: 'Giant Sukuma',
            price: 70,
            farmer: 'Harzel Adwet',
            location: 'Kisumu',
            rating: 4.9,
            orders: 156,
            category: 'kales',
            image: sukumaImage,
            unit: 'bundle',
            minOrder: 2,
            available: true,
            description: 'Extra large bundles, great value for money'
        },
        {
            id: 5,
            name: 'Traditional Sukuma',
            price: 55,
            farmer: 'Viera man',
            location: 'Eldoret',
            rating: 4.6,
            orders: 98,
            category: 'kales',
            image: sukumaImage,
            unit: 'bundle',
            minOrder: 5,
            available: true,
            description: 'Traditional variety, rich in flavor'
        },
        {
            id: 6,
            name: 'Morning Harvest Sukuma',
            price: 65,
            farmer: 'Lucy Wairimu',
            location: 'Kesses',
            rating: 5.0,
            orders: 45,
            category: 'kales',
            image: sukumaImage,
            unit: 'bundle',
            minOrder: 3,
            available: true,
            description: 'Harvested at dawn, delivered fresh'
        },
        // Additional vegetables for variety
        {
            id: 7,
            name: 'Fresh Spinach',
            price: 40,
            farmer: 'Mercy masika',
            location: 'kajiado',
            rating: 4.7,
            orders: 167,
            category: 'spinach',
            image: sukumaImage,
            unit: 'bundle',
            minOrder: 3,
            available: true,
            description: 'Tender spinach leaves, perfect for salads'
        },
        {
            id: 8,
            name: 'Organic Cabbage',
            price: 80,
            farmer: 'Sarah Chebet',
            location: 'moi',
            rating: 4.8,
            orders: 203,
            category: 'cabbage',
            image: sukumaImage,
            unit: 'piece',
            minOrder: 2,
            available: true,
            description: 'Large, dense cabbages from organic farm'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Vegetables', icon: '🌿' },
        { id: 'kales', name: 'Sukuma Wiki', icon: '🥬' },
        { id: 'spinach', name: 'Spinach', icon: '🌱' },
        { id: 'cabbage', name: 'Cabbage', icon: '🥬' },
        { id: 'tomatoes', name: 'Tomatoes', icon: '🍅' },
    ];

    const farmers = [
        { id: 1, name: 'Dorcas Agwenge', rating: 4.8, products: 12, location: 'Kiambu' },
        { id: 2, name: 'Viera man', rating: 4.9, products: 8, location: 'Kisumu' },
        { id: 3, name: 'Harzel Adwet', rating: 4.7, products: 15, location: 'Nakuru' },
    ];

    // Filter products based on search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
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
            return [...prevCart, { ...product, quantity: 1 }];
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
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Navigate to checkout page or show checkout modal
        alert('Proceeding to checkout...');
        // navigate('/checkout');
    };

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
                            <select className="location-dropdown">
                                <option>Kesses</option>
                                <option>Mabs</option>
                                <option>Eldoret</option>
                                <option>chebarus</option>
                                <option>stage</option>
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
                                        src={item.image}
                                        alt={item.name}
                                        className="cart-item-image"
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
                                <span>KES {getCartTotal()}</span>
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button className="search-button">🔍</button>
                    </div>

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
                                <div className="product-badge">
                                    {product.rating >= 4.8 && '⭐ Top Rated'}
                                </div>
                                <div className="product-image-container">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                    {!product.available && (
                                        <div className="sold-out">Sold Out</div>
                                    )}
                                </div>

                                <div className="product-details">
                                    <div className="product-header">
                                        <h3 className="product-title">{product.name}</h3>
                                        <span className="product-unit">per {product.unit}</span>
                                    </div>

                                    <p className="product-description">{product.description}</p>

                                    <div className="product-farmer-info">
                                        <span className="farmer-name">👨‍🌾 {product.farmer}</span>
                                        <span className="farmer-location">📍 {product.location}</span>
                                    </div>

                                    <div className="product-meta">
                                        <div className="product-rating">
                                            <span className="stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
                                            <span className="rating-value">{product.rating}</span>
                                            <span className="orders">({product.orders} orders)</span>
                                        </div>
                                        <div className="product-min-order">
                                            Min: {product.minOrder} {product.unit}s
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
                                            >
                                                Buy Now
                                            </button>
                                            <button
                                                className="add-to-cart-button"
                                                onClick={() => addToCart(product)}
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
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Farmers Nearby Section */}
            <section className="farmers-section">
                <div className="container">
                    <h2 className="section-title">Top Farmers Near You</h2>
                    <div className="farmers-grid">
                        {farmers.map(farmer => (
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
                                    <p className="farmer-products">{farmer.products} products available</p>
                                    <button className="view-farmer-btn">View Farm</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Order Section */}
            <section className="quick-order-section">
                <div className="container">
                    <div className="quick-order-banner">
                        <div className="quick-order-content">
                            <h2>Need Sukuma in a Hurry?</h2>
                            <p>Get express delivery within 2 hours in Moi university</p>
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