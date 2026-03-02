import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import our new component pieces
import NavigationBar from '../components/NavigationBar';
import SearchSection from '../components/SearchSection';
import ProductsGrid from '../components/ProductsGrid';
import CartSidebar from '../components/CartSidebar';
import Notification from '../components/Notification';
import LoadingState from '../components/LoadingState';

// Import custom hook for cart operations
import { useCart } from '../hooks/useCart';
// Import custom hook for products
import { useProducts } from '../hooks/useProducts';

import './findVegetables.css';

function FindVegetables({ onBack }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    // UI State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Use our custom hooks for business logic Back
    const {
        products,
        loading: productsLoading,
        error: productsError,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedLocation,
        setSelectedLocation,
        locations,
        categories,
        fetchProducts,
        clearFilters
    } = useProducts();

    const {
        cart,
        cartId,
        cartTotal,
        deliveryFee,
        grandTotal,
        addToCart,
        updateCartItem,
        removeFromCart,
        handleCheckout,
        checkoutData,
        setCheckoutData,
        submitting
    } = useCart(user, showNotification);

    // Helper function to show notifications
    function showNotification(message, type = 'success') {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }

    // Show loading state
    if (productsLoading && products.length === 0) {
        return <LoadingState />;
    }

    return (
        <div className="find-vegetables">
            {/* Notification Component */}
            <Notification
                show={notification.show}
                message={notification.message}
                type={notification.type}
            />

            {/* Navigation Bar Component */}
            <NavigationBar
                
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                locations={locations}
                cartItemsCount={cart?.items_count || 0}
                onCartClick={() => setIsCartOpen(true)}
            />

            {/* Main Content */}
            <div className="main-content">
                {/* Search Section Component */}
                <SearchSection
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={fetchProducts}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={categories}
                />

                {/* Products Grid Component */}
                <ProductsGrid
                    products={products}
                    error={productsError}
                    onRetry={fetchProducts}
                    onAddToCart={addToCart}
                    onClearFilters={clearFilters}
                />
            </div>

            {/* Cart Sidebar Component */}
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(false);
                }}
                cart={cart}
                cartTotal={cartTotal}
                deliveryFee={deliveryFee}
                grandTotal={grandTotal}
                onUpdateItem={updateCartItem}
                onRemoveItem={removeFromCart}
                isCheckoutOpen={isCheckoutOpen}
                onCheckout={() => setIsCheckoutOpen(true)}
                onBackToCart={() => setIsCheckoutOpen(false)}
                onSubmitOrder={handleCheckout}
                checkoutData={checkoutData}
                setCheckoutData={setCheckoutData}
                submitting={submitting}
            />
        </div>
    );
}

export default FindVegetables;