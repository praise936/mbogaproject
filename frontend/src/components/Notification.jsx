import React from 'react';

function Notification({ show, message, type }) {
    if (!show) return null;

    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    );
}

export default Notification;