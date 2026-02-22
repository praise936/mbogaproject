// Landing.jsx
import React from 'react';
import './landing.css';
import skuma from '../assets/fresh-sukuma.png';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();

    const products = [
        { id: 1, name: 'Fresh Sukuma', price: '50 KES', farmer: 'Joseph Mwangi', location: 'Kiambu' },
        { id: 2, name: 'Organic Sukuma', price: '60 KES', farmer: 'Grace Akinyi', location: 'Kisumu' },
        { id: 3, name: 'Premium Sukuma', price: '45 KES', farmer: 'Peter Omondi', location: 'Nakuru' },
        { id: 4, name: 'Giant Sukuma', price: '70 KES', farmer: 'Mary Wanjiku', location: 'Nyeri' },
    ];

    return (
        <main className="landing">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Buy Fresh Sukuma <span className="highlight">Direct From Farmers</span>
                        </h1>
                        <p className="hero-subtitle">
                            Connecting Mama Mboga with trusted farmers at fair prices.
                        </p>
                        <div className="hero-buttons">
                            <button
                                onClick={() => navigate('/market')}  // FIXED: Arrow function
                                className="button button-primary"
                            >
                                Find Vegetables
                            </button>
                            <button
                                onClick={() => navigate('/sell')}  // FIXED: Added navigation
                                className="button button-secondary"
                            >
                                Sell Your Produce
                            </button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src={skuma} alt="Fresh sukuma/kales" className="image-placeholder hero-placeholder" />
                    </div>
                </div>
            </section>

            {/* Problem Solution Section */}
            <section className="problems-section">
                <div className="container">
                    <h2 className="section-title">Problems We Solve</h2>
                    <div className="cards-grid">
                        <div className="problem-card">
                            <div className="card-icon">💰</div>
                            <h3>Middlemen increase prices</h3>
                            <p>Farmers get fair prices, mama mboga pay less</p>
                        </div>
                        <div className="problem-card">
                            <div className="card-icon">📦</div>
                            <h3>Unreliable supply</h3>
                            <p>Direct connection ensures steady access</p>
                        </div>
                        <div className="problem-card">
                            <div className="card-icon">⭐</div>
                            <h3>Poor quality produce</h3>
                            <p>Fresh sukuma straight from farm</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="how-it-works-grid">
                        <div className="how-card">
                            <h3 className="card-title">For Mama Mboga</h3>
                            <div className="steps">
                                <div className="step">1. Browse sukuma</div>
                                <div className="step">2. Order from farmer</div>
                                <div className="step">3. Receive delivery</div>
                            </div>
                        </div>
                        <div className="how-card">
                            <h3 className="card-title">For Farmers</h3>
                            <div className="steps">
                                <div className="step">1. Post harvest</div>
                                <div className="step">2. Get orders</div>
                                <div className="step">3. Get paid</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Sukuma */}
            <section className="featured-section">
                <div className="container">
                    <h2 className="section-title">Featured Sukuma</h2>
                    <div className="products-grid">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image-placeholder">
                                    <span>Sukuma Image</span>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">{product.price} per bundle</p>
                                    <p className="product-farmer">Farmer: {product.farmer}</p>
                                    <p className="product-location">📍 {product.location}</p>
                                    <button
                                        onClick={() => navigate(`/product/${product.id}`)}  // FIXED: Added navigation
                                        className="button button-primary order-button"
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="trust-section">
                <div className="container">
                    <h2 className="section-title">Why Trust FarmLink</h2>
                    <div className="trust-grid">
                        <div className="trust-item">
                            <span className="trust-icon">✅</span>
                            <span>Verified Farmers</span>
                        </div>
                        <div className="trust-item">
                            <span className="trust-icon">🔒</span>
                            <span>Secure Payments</span>
                        </div>
                        <div className="trust-item">
                            <span className="trust-icon">🚚</span>
                            <span>Fast Delivery</span>
                        </div>
                        <div className="trust-item">
                            <span className="trust-icon">🌿</span>
                            <span>Fresh Quality</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Start Buying Fresh Sukuma Today</h2>
                        <div className="cta-buttons">
                            <button
                                onClick={() => navigate('/join/mamamboga')}  // FIXED: Added navigation
                                className="button button-light"
                            >
                                Join as Mama Mboga
                            </button>
                            <button
                                onClick={() => navigate('/join/farmer')}  // FIXED: Added navigation
                                className="button button-light"
                            >
                                Join as Farmer
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Landing;