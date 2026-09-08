import React from 'react';

const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  counts
}) => {
  return (
    <div className="search-filter-container">
      {/* Search Input Box */}
      <div className="search-box">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search-btn" onClick={() => setSearchTerm('')} title="Clear search">
            &times;
          </button>
        )}
      </div>

      <div className="filter-sort-wrapper">
        {/* Filter Pills */}
        <div className="filter-pills">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All <span className="pill-badge">{counts.all}</span>
          </button>
          <button
            className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Active <span className="pill-badge">{counts.active}</span>
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed <span className="pill-badge">{counts.completed}</span>
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="sort-dropdown-wrapper">
          <label htmlFor="sort-select" className="sort-label">Sort by:</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alpha">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
