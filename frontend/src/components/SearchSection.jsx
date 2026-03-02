import React from 'react';

function SearchSection({
    searchTerm,
    setSearchTerm,
    onSearch,
    selectedCategory,
    setSelectedCategory,
    categories
}) {
    return (
        <section className="search-section">
            <div className="search-wrapper">
                {/* Search input */}
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search vegetables or farmers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    />
                    <button className="search-button" onClick={onSearch}>
                        🔍
                    </button>
                </div>

                {/* Category filters */}
                <div className="categories-scroll">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            <span className="category-name">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default SearchSection;