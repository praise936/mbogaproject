import React from 'react';
import ProductCard from './ProductCard';

function ProductsGrid({ products, error, onRetry, onAddToCart, onClearFilters }) {
    // Show error state
    if (error) {
        return (
            <section className="products-section">
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={onRetry}>Try Again</button>
                </div>
            </section>
        );
    }

    // Show empty state
    if (products.length === 0) {
        return (
            <section className="products-section">
                <div className="empty-state">
                    <p>No products found matching your criteria</p>
                    <button className="clear-filters" onClick={onClearFilters}>
                        Clear Filters
                    </button>
                </div>
            </section>
        );
    }

    // Show products grid
    return (
        <section className="products-section">
            <div className="products-header">
                <h2>Available Vegetables</h2>
                <span className="product-count">{products.length} items</span>
            </div>

            <div className="products-grid">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>
        </section>
    );
}

export default ProductsGrid;