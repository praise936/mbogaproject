import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Phone,
    MapPin,
    Calendar,
    Leaf,
    Package,
    Edit3,
    Camera
} from 'lucide-react';
import './FarmerProfile.css';
import api from '../services/api';

const FarmerProfile = () => {
    const [farmer, setFarmer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFarmerDetails();
    }, []);

    const fetchFarmerDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get('profile/');
            console.log(response.data);
            setFarmer(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleAddProduct = () => {
        navigate('/sell');
    };

    if (loading) {
        return (
            <div className="profile-loading-container">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-error-container">
                <div className="error-card">
                    <div className="error-icon">!</div>
                    <h2 className="error-title">Oops! Something went wrong</h2>
                    <p className="error-message">{error}</p>
                    <button
                        onClick={fetchFarmerDetails}
                        className="retry-button"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!farmer) return null;

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                {/* Header Section */}
                <div className="profile-header">
                    <h1 className="profile-title">My Farmer Profile</h1>
                    <p className="profile-subtitle">Welcome back, {farmer.name}! Here's an overview of your farming profile.</p>
                </div>

                {/* Main Profile Card */}
                <div className="profile-card">
                    {/* Cover Photo */}
                    <div className="cover-photo">
                        {farmer.cover_photo && (
                            <img
                                src={farmer.cover_photo}
                                alt="Farm cover"
                                className="cover-image"
                            />
                        )}
                    </div>

                    {/* Profile Info Section */}
                    <div className="profile-info-section">
                        {/* Profile Picture */}
                        <div className="profile-picture-section">
                            <div className="profile-picture-wrapper">
                                <div className="profile-picture">
                                    {farmer.profile_picture ? (
                                        <img
                                            src={farmer.profile_picture}
                                            alt={farmer.name}
                                            className="profile-image"
                                        />
                                    ) : (
                                        <div className="profile-placeholder">
                                            <User size={48} className="placeholder-icon" />
                                        </div>
                                    )}
                                </div>
                                <button className="camera-button">
                                    <Camera size={20} className="camera-icon" />
                                </button>
                            </div>

                            <button className="edit-profile-button">
                                <Edit3 size={18} />
                                Edit Profile
                            </button>
                        </div>

                        {/* Name and Badge */}
                        <div className="name-section">
                            <div className="name-badge-wrapper">
                                <h2 className="farmer-name">{farmer.name}</h2>
                                <span className="verified-badge">
                                    <Leaf size={14} />
                                    Verified Farmer
                                </span>
                            </div>
                            <p className="farmer-id">Farmer ID: {farmer.id}</p>
                        </div>

                        {/* Contact and Location Grid */}
                        <div className="info-grid">
                            <div className="info-card">
                                <div className="info-icon-wrapper">
                                    <Phone className="info-icon" size={24} />
                                </div>
                                <div>
                                    <p className="info-label">Phone Number</p>
                                    <p className="info-value">
                                        {farmer.phone_number || 'Not provided'}
                                    </p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon-wrapper">
                                    <MapPin className="info-icon" size={24} />
                                </div>
                                <div>
                                    <p className="info-label">Farm Location</p>
                                    <p className="info-value">
                                        {farmer.location || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="about-section">
                            <h3 className="section-title">About Me</h3>
                            <p className="bio-text">
                                {farmer.bio || "I'm a dedicated farmer committed to providing fresh, organic produce to my community. With years of experience in sustainable farming, I take pride in growing high-quality fruits and vegetables using environmentally friendly practices."}
                            </p>

                            <div className="meta-grid">
                                <div className="meta-item">
                                    <Calendar size={18} className="meta-icon" />
                                    <span>Member since {formatDate(farmer.date_joined)}</span>
                                </div>
                                <div className="meta-item">
                                    <Package size={18} className="meta-icon" />
                                    <span>{farmer.total_products || 0} Products Listed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="products-card">
                    <div className="products-header">
                        <h3 className="products-title">My Products</h3>
                        <button onClick={handleAddProduct} className="view-all-button">
                            View All Products →
                        </button>
                    </div>

                    {farmer.products && farmer.products.length > 0 ? (
                        <div className="products-grid">
                            {farmer.products.map((product) => (
                                <div key={product.id} className="product-card">
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                    )}
                                    <div className="product-details">
                                        <h4 className="product-name">{product.name}</h4>
                                        <p className="product-description">{product.description}</p>
                                        <div className="product-footer">
                                            <span className="product-price">KES {product.price}</span>
                                            <span className="product-quantity">per {product.unit || 'kg'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-products">
                            <Package size={48} className="empty-icon" />
                            <p className="empty-text">No products listed yet</p>
                            <button onClick={handleAddProduct} className="add-product-button">
                                Add Your First Product
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerProfile;