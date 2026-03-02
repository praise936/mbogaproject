import React from 'react';

function CartItem({ item, onUpdate, onRemove }) {
    return (
        <div className="cart-item">
            {/* Item image */}
            <img
                src={item.product_image_url || '/default-product.png'}
                alt={item.product_name}
                className="cart-item-image"
            />

            {/* Item content */}
            <div className="cart-item-content">
                {/* Header with remove button */}
                <div className="cart-item-header">
                    <h4>{item.product_name}</h4>
                    <button className="remove-item" onClick={() => onRemove(item.id)}>
                        ×
                    </button>
                </div>

                {/* Price */}
                <p className="cart-item-price">
                    KES {item.price_per_unit} × {item.quantity} {item.unit}
                </p>

                {/* Quantity controls */}
                <div className="quantity-controls">
                    <button
                        onClick={() => onUpdate(item.id, item.quantity - 1)}
                        className="quantity-button"
                    >-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                        onClick={() => onUpdate(item.id, item.quantity + 1)}
                        className="quantity-button"
                    >+</button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;