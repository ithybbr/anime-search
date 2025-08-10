import React, { useState, useEffect } from 'react';
import ApiGetProducers from './ApiGetProducers';
import './ProducersList.css';

export default function ProducersList() {
    const [producers, setProducers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);

    useEffect(() => {
        async function fetchProducers() {
            setLoading(true);
            try {
                const data = await ApiGetProducers(currentPage);
                setProducers(data.data);
                
                // Assuming your API returns pagination info
                // Adjust these based on your actual API response structure
                setTotalPages(data.pagination?.last_visible_page || 1);
                setHasNextPage(data.pagination?.has_next_page || false);
                
                console.log(data.data);
            } catch (err) {
                setError("Failed to load producers");
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducers();
    }, [currentPage]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatFavorites = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count?.toString() || '0';
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 5;
        
        // Calculate the range of buttons to show
        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
        
        // Adjust start if we're near the end
        if (endPage - startPage + 1 < maxVisibleButtons) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        // Previous button
        buttons.push(
            <button
                key="prev"
                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ‹ Previous
            </button>
        );

        // First page and ellipsis
        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(
                    <span key="ellipsis1" className="pagination-ellipsis">...</span>
                );
            }
        }

        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        // Last page and ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="ellipsis2" className="pagination-ellipsis">...</span>
                );
            }
            buttons.push(
                <button
                    key={totalPages}
                    className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        buttons.push(
            <button
                key="next"
                className={`pagination-btn ${currentPage === totalPages || !hasNextPage ? 'disabled' : ''}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || !hasNextPage}
            >
                Next ›
            </button>
        );

        return buttons;
    };

    if (loading) {
        return (
            <div className="producers-container">
                <div className="loading">Loading producers...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="producers-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="producers-container">
            <h1 className="producers-title">
                <a href='/' className="pagination-btn" style={{display: 'table'}}>Back to Search</a>
                Anime Producers
            </h1>
            <ul className="producers-grid">
                {producers.map((producer) => (
                    <li key={producer.mal_id} className="producer-card">
                        <div className="producer-header">
                            {producer.images?.jpg?.image_url ? (
                                <img 
                                    src={producer.images.jpg.image_url} 
                                    alt={producer.titles[0]?.title || 'Producer'} 
                                    className="producer-image"
                                />
                            ) : (
                                <div className="producer-image-placeholder">
                                    {producer.titles[0]?.title?.charAt(0) || '?'}
                                </div>
                            )}
                            <div className="producer-info">
                                <h3 className="producer-name">
                                    {producer.titles[0]?.title || 'Unknown Producer'}
                                </h3>
                                {producer.titles[0]?.type && (
                                    <span className="producer-type">
                                        {producer.titles[0].type}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="producer-details">
                            {producer.established && (
                                <div className="producer-detail">
                                    <span className="detail-label">Established:</span>
                                    <span className="detail-value established-date">
                                        {formatDate(producer.established)}
                                    </span>
                                </div>
                            )}
                            {producer.favorites && (
                                <div className="producer-detail">
                                    <span className="detail-label">Favorites:</span>
                                    <span className="detail-value">
                                        <span className="favorites-count">
                                            {formatFavorites(producer.favorites)}
                                        </span>
                                    </span>
                                </div>
                            )}
                            {producer.count && (
                                <div className="producer-detail">
                                    <span className="detail-label">Productions:</span>
                                    <span className="detail-value">{producer.count}</span>
                                </div>
                            )}
                        </div>

                        {producer.about && (
                            <div className="producer-about">
                                {producer.about}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="pagination-controls">
                        {renderPaginationButtons()}
                    </div>
                </div>
            )}
        </div>
    );
}