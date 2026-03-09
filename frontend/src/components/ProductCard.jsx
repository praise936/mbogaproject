import React from 'react';

function ProductCard({ product, onAddToCart }) {
    return (
        <article className="product-card">
            {/* Product image */}
            <div className="product-image-container">
                <img
                    src={product.image_url || '/default-product.png'}
                    alt={product.name}
                    className="product-image"
                />
                {/* {!product.is_available && (
                    <span className="product-badge sold-out">Sold Out</span>
                )} */}
            </div>

            {/* Product details */}
            <div className="product-details">
                <h3 className="product-name">{product.name}</h3>

                {/* Farmer and location info */}
                <div className="product-meta">
                    <span className="farmer-info">
                        👨‍🌾 {product.farmer_name}
                    </span>
                    <span className="location-info">
                        📍 {product.location}
                    </span>
                </div>

                {/* Price and stock */}
                <div className="product-footer">
                    <div className="price-info">
                        <span className="price">KES {product.price}</span>
                        <span className="unit">/{product.unit}</span>
                    </div>
                    <span className="stock-info">
                        {product.quantity_available} available
                    </span>
                </div>

                {/* Add to cart button */}
                <button
                    className="add-button"
                    onClick={() => onAddToCart(product)}
                    disabled={!product.is_available || product.quantity_available <= 0}
                >
                    Add to Cart
                </button>
            </div>
        </article>
    );
}

export default ProductCard;