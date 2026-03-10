import { useState, useEffect } from 'react';
import axios from 'axios';
import publicApi from '../services/publicApi';

export function useCart(user, showNotification) {
    // Cart state
    const [cartId, setCartId] = useState(localStorage.getItem('cart_id') || null);
    const [cart, setCart] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Checkout form state
    const [checkoutData, setCheckoutData] = useState({
        customer_name: '',
        customer_phone: '',
        customer_email: user?.email || '',
        delivery_address: '',
        delivery_instructions: '',
        delivery_fee: 50
    });

    // API configuration
    // const api = axios.create({
    //     baseURL: 'http://127.0.0.1:8000/api/',
    //     headers: { 'Content-Type': 'application/json' }
    // });

    // // Add token to requests
    // api.interceptors.request.use(config => {
    //     const token = localStorage.getItem('access_token');
    //     if (token) config.headers.Authorization = `Bearer ${token}`;
    //     return config;
    // });

    // Load or create cart on mount
    useEffect(() => {
        if (cartId) {
            fetchCart();
        } else {
            createNewCart();
        }
    }, [cartId]);

    // Computed values
    const cartTotal = parseFloat(cart?.subtotal) || 0;
    const deliveryFee = parseFloat(checkoutData.delivery_fee) || 0;
    const grandTotal = cartTotal + deliveryFee;

    // Create new cart
    const createNewCart = async () => {
        try {
            const response = await publicApi.get('cart/');
            const newCartId = response.data.cart_id;
            console.log(response.data);
            
            setCartId(newCartId);
            localStorage.setItem('cart_id', newCartId);
            setCart(response.data.cart);
        } catch (err) {
            console.error('Error creating cart:', err);
        }
    };

    // Fetch existing cart
    const fetchCart = async () => {
        try {
            const response = await publicApi.get(`cart/?cart_id=${cartId}`);
            setCart(response.data.cart);
            console.log(response.data);
            
        } catch (err) {
            console.error('Error fetching cart:', err);
            if (err.response?.status === 404) createNewCart();
        }
    };

    // Add item to cart
    const addToCart = async (product) => {
        try {
            const response = await publicApi.post('cart/add/', {
                product_id: product.id,
                quantity: 1,
                cart_id: cartId
            });

            setCartId(response.data.cart_id);
            console.log(response.data);
            
            localStorage.setItem('cart_id', response.data.cart_id);
            setCart(response.data.cart);
            showNotification(`${product.name} added to cart!`);
        } catch (err) {
            showNotification(err.response?.data?.error || 'Failed to add to cart', 'error');
        }
    };

    // Update cart item quantity
    const updateCartItem = async (itemId, quantity) => {
        try {
            const response = await publicApi.put('cart/update/', {
                item_id: itemId,
                quantity,
                cart_id: cartId
            });
            setCart(response.data.cart);
        } catch (err) {
            showNotification('Failed to update cart', 'error');
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        try {
            const response = await publicApi.delete(`cart/remove/?cart_id=${cartId}&item_id=${itemId}`);
            setCart(response.data.cart);
            showNotification('Item removed from cart');
        } catch (err) {
            showNotification('Failed to remove item', 'error');
        }
    };

    // Handle checkout
    const handleCheckout = async () => {
        if (!checkoutData.customer_name || !checkoutData.customer_phone || !checkoutData.delivery_address) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            setSubmitting(true);
            const response = await publicApi.post('checkout/', {
                ...checkoutData,
                cart_id: cartId
            });
            console.log(response.data);
            

            // Clear cart after successful order
            localStorage.removeItem('cart_id');
            setCartId(null);
            setCart(null);

            showNotification(`Order placed successfully! Order number: ${response.data.order_numbers.join(', ')}`);

            // Reset form
            setCheckoutData({
                customer_name: '',
                customer_phone: '',
                customer_email: user?.email || '',
                delivery_address: '',
                delivery_instructions: '',
                delivery_fee: 50
            });

            return response.data;
        } catch (err) {
            showNotification(err.response?.data?.error || 'Failed to place order', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return {
        cart,
        cartId,
        cartTotal,
        deliveryFee,
        grandTotal,
        submitting,
        checkoutData,
        setCheckoutData,
        addToCart,
        updateCartItem,
        removeFromCart,
        handleCheckout
    };
}