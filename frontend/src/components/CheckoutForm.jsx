import React from 'react';

function CheckoutForm({
    checkoutData,
    setCheckoutData,
    cartTotal,
    deliveryFee,
    grandTotal,
    onBack,
    onSubmit,
    submitting
}) {
    return (
        <div className="checkout-section">
            <h3>Delivery Details</h3>

            {/* Form fields */}
            <div className="checkout-form">
                <input
                    type="text"
                    placeholder="Full Name *"
                    value={checkoutData.customer_name}
                    onChange={(e) => setCheckoutData({
                        ...checkoutData,
                        customer_name: e.target.value
                    })}
                />

                <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={checkoutData.customer_phone}
                    onChange={(e) => setCheckoutData({
                        ...checkoutData,
                        customer_phone: e.target.value
                    })}
                />

                {/* <input
                    type="email"
                    placeholder="Email Address"
                    value={checkoutData.customer_email}
                    onChange={(e) => setCheckoutData({
                        ...checkoutData,
                        customer_email: e.target.value
                    })}
                /> */}

                <textarea
                    placeholder="Delivery Address *"
                    value={checkoutData.delivery_address}
                    onChange={(e) => setCheckoutData({
                        ...checkoutData,
                        delivery_address: e.target.value
                    })}
                    rows="2"
                />

                <textarea
                    placeholder="Delivery Instructions (Optional)"
                    value={checkoutData.delivery_instructions}
                    onChange={(e) => setCheckoutData({
                        ...checkoutData,
                        delivery_instructions: e.target.value
                    })}
                    rows="2"
                />
            </div>

            {/* Order summary */}
            <div className="checkout-summary">
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

                {/* Action buttons */}
                <div className="checkout-actions">
                    <button className="back-button" onClick={onBack}>
                        Back
                    </button>
                    <button
                        className="place-order-button"
                        onClick={onSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutForm;