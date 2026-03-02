import React from 'react';

function LoadingState() {
    return (
        <div className="find-vegetables">
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading fresh vegetables...</p>
            </div>
        </div>
    );
}

export default LoadingState;