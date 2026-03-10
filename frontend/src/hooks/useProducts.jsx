import { useState, useEffect } from 'react';
import publicApi from '../services/publicApi';

export function useProducts() {
    // State for filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');

    // State for products data
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Categories data (can be moved to a separate constants file)
    const categories = [
        { id: 'all', name: 'All Vegetables', icon: '🌿' },
        { id: 'Sukuma', name: 'Sukuma Wiki', icon: '🥬' },
        { id: 'Spinach', name: 'Spinach', icon: '🌱' },
        { id: 'Cabbage', name: 'Cabbage', icon: '🥬' },
        { id: 'Kale', name: 'Kale', icon: '🥬' },
        { id: 'Lettuce', name: 'Lettuce', icon: '🥗' },
    ];

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, selectedLocation]);

    // Get unique locations from products
    const locations = ['all', ...new Set(products.map(p => p.location).filter(Boolean))];

    // Function to fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedCategory !== 'all') params.category = selectedCategory;
            if (selectedLocation !== 'all') params.location = selectedLocation;
            if (searchTerm) params.search = searchTerm;

            const response = await publicApi.get('products/', { params });
            console.log(response.data);
            
            setProducts(response.data.results || response.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to load products');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to clear all filters
    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedLocation('all');
        setSearchTerm('');
        fetchProducts();
    };

    return {
        products,
        loading,
        error,
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
    };
}