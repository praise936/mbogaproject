import React from 'react';

function NavigationBar({
    onBack,
    selectedLocation,
    setSelectedLocation,
    locations,
    cartItemsCount,
    onCartClick
}) {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-left">
                    {/* Back button */}
                    {/* <button className="nav-back" onClick={onBack}>
                        ← Back
                    </button> */}
                    <h1 className="nav-title">Fresh Market</h1>
                </div>

                <div className="nav-right">
                    {/* Location dropdown */}
                    <select
                        className="location-dropdown"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                        {locations.map(loc => (
                            <option key={loc} value={loc}>
                                {loc === 'all' ? '📍 All Locations' : `📍 ${loc}`}
                            </option>
                        ))}
                    </select>

                    {/* Cart button with badge */}
                    <button className="cart-icon" onClick={onCartClick}>
                        🛒
                        {cartItemsCount > 0 && (
                            <span className="cart-badge">{cartItemsCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default NavigationBar;