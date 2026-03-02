import React from 'react';
import CartItem from './CartItem';
import CheckoutForm from './CheckoutForm';

function CartSidebar({
    isOpen,
    onClose,
    cart,
    cartTotal,
    deliveryFee,
    grandTotal,
    onUpdateItem,
    onRemoveItem,
    isCheckoutOpen,
    onCheckout,
    onBackToCart,
    onSubmitOrder,
    checkoutData,
    setCheckoutData,
    submitting
}) {
    if (!isOpen) return null;

    return (
        <div className="cart-overlay">
            <div className="cart-sidebar">
                {/* Header */}
                <div className="cart-sidebar-header">
                    <h2>Your Cart</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                {/* Empty cart state */}
                {!cart?.items?.length ? (
                    <div className="cart-empty">
                        <p>Your cart is empty</p>
                        <button className="continue-shopping" onClick={onClose}>
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Cart items list */}
                        <div className="cart-items-list">
                            {cart.items.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdate={onUpdateItem}
                                    onRemove={onRemoveItem}
                                />
                            ))}
                        </div>

                        {/* Cart footer with checkout or form */}
                        <div className="cart-footer">
                            {!isCheckoutOpen ? (
                                <CartSummary
                                    cartTotal={cartTotal}
                                    deliveryFee={deliveryFee}
                                    grandTotal={grandTotal}
                                    onCheckout={onCheckout}
                                />
                            ) : (
                                <CheckoutForm
                                    checkoutData={checkoutData}
                                    setCheckoutData={setCheckoutData}
                                    cartTotal={cartTotal}
                                    deliveryFee={deliveryFee}
                                    grandTotal={grandTotal}
                                    onBack={onBackToCart}
                                    onSubmit={onSubmitOrder}
                                    submitting={submitting}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Internal component for cart summary
function CartSummary({ cartTotal, deliveryFee, grandTotal, onCheckout }) {
    return (
        <div className="cart-summary">
            <div className="summary-row">
                <span>Subtotal</span>
                <span>KES {cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
                <span>Delivery</span>
                <span>KES {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
                <span>Total</span>
                <span>KES {grandTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-button" onClick={onCheckout}>
                Proceed to Checkout
            </button>
        </div>
    );
}

export default CartSidebar;