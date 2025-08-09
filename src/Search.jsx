import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';
import ApiSearch from './ApiSearch';

// SearchSection Component - Now includes Type and Status filters
const SearchSection = ({ q, type, status, onQChange, onTypeChange, onStatusChange }) => (
    <div className="anime-form-search-section">
        <div className="anime-form-section-header">
            <div className="anime-form-section-indicator"></div>
            <h2 className="anime-form-section-title">Search & Quick Filters</h2>
        </div>
        <div className="anime-form-search-row">
            <input
                type="text"
                value={q}
                onChange={onQChange}
                placeholder="Search for anime titles, characters, or keywords..."
                className="anime-form-search-input"
            />
            <select value={type} onChange={onTypeChange} className="anime-form-search-select">
                <option value="">All Types</option>
                <option value="tv">TV Series</option>
                <option value="movie">Movie</option>
                <option value="ova">OVA</option>
                <option value="special">Special</option>
                <option value="ona">ONA</option>
                <option value="music">Music</option>
                <option value="cm">CM</option>
                <option value="pv">PV</option>
                <option value="tv_special">TV Special</option>
            </select>
            <select value={status} onChange={onStatusChange} className="anime-form-search-select">
                <option value="">Any Status</option>
                <option value="airing">Currently Airing</option>
                <option value="complete">Completed</option>
                <option value="upcoming">Upcoming</option>
            </select>
        </div>
    </div>
);

// CompactFilters Component - Now includes dates and excludes type/status
const CompactFilters = ({ 
    rating, sfw, minRating, maxRating, orderBy, sort, start_date, end_date,
    onRatingChange, onSfwChange, onMinChange, onMaxChange, 
    onOrderByChange, onSortChange, onStartDateChange, onEndDateChange 
    }) => (
    <div className="anime-form-section">
        <div className="anime-form-section-header">
            <div className="anime-form-section-indicator"></div>
            <h2 className="anime-form-section-title">Filters & Sorting</h2>
        </div>
        <div className="anime-form-compact-grid">
            <div className="anime-form-field-group">
                <label className="anime-form-label">Min Rating</label>
                <input
                    type="number"
                    value={minRating}
                    onChange={onMinChange}
                    placeholder="0.0"
                    min="0"
                    max="10"
                    step="0.1"
                    className="anime-form-input"
                />
            </div>
            <div className="anime-form-field-group">
                <label className="anime-form-label">Max Rating</label>
                <input
                    type="number"
                    value={maxRating}
                    onChange={onMaxChange}
                    placeholder="10.0"
                    min="0"
                    max="10"
                    step="0.1"
                    className="anime-form-input"
                />
            </div>
            <div className="anime-form-field-group">
                <label className="anime-form-label">Start Date</label>
                <input
                    type="date"
                    value={start_date}
                    onChange={onStartDateChange}
                    className="anime-form-input"
                />
            </div>
            <div className="anime-form-field-group">
                <label className="anime-form-label">End Date</label>
                <input
                    type="date"
                    value={end_date}
                    onChange={onEndDateChange}
                    className="anime-form-input"
                />
            </div>
            <div className="anime-form-field-group">
                <label className="anime-form-label">Age Rating</label>
                <select value={rating} onChange={onRatingChange} className="anime-form-select">
                    <option value="">Any Rating</option>
                    <option value="g">All Ages</option>
                    <option value="pg">Children</option>
                    <option value="pg13">Teens 13+</option>
                    <option value="r17">17+ (Violence & Profanity)</option>
                    <option value="r">Mild Nudity</option>
                    <option value="rx">Hentai</option>
                </select>
            </div>
            <div className="anime-form-field-group">
                <label className="anime-form-label">Order By</label>
                <select value={orderBy} onChange={onOrderByChange} className="anime-form-select">
                    <option value="">Default</option>
                    <option value="mal_id">ID</option>
                    <option value="title">Title</option>
                    <option value="start_date">Start Date</option>
                    <option value="end_date">End Date</option>
                    <option value="episodes">Episodes</option>
                    <option value="score">Score</option>
                    <option value="scored_by">Scored By</option>
                    <option value="rank">Rank</option>
                    <option value="popularity">Popularity</option>
                    <option value="members">Members</option>
                    <option value="favorites">Favorites</option>
                </select>
            </div>
            <div className="anime-form-field-group">
                <label className="anime-form-label">Sort Direction</label>
                <select value={sort} onChange={onSortChange} className="anime-form-select">
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
            <div className="anime-form-field-group anime-form-sfw-field">
                <div className="anime-form-checkbox-container">
                    <label className="anime-form-checkbox-label">
                        <input
                            type="checkbox"
                            checked={sfw}
                            onChange={onSfwChange}
                            className="anime-form-checkbox"
                        />
                        <span className="anime-form-checkbox-text">Safe For Work Only</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
);

// AdditionalFilters Component - Now includes genres and producers only
const AdditionalFilters = ({ genres, genresExclude, producers, onGenresChange, onGenresExcludeChange, onProducersChange }) => (
    <div className="anime-form-section">
        <div className="anime-form-section-header">
            <div className="anime-form-section-indicator"></div>
            <h2 className="anime-form-section-title">Additional Filters</h2>
            <h2 className="anime-form-section-title">
                <a href="/genres" className="anime-form-link">View All Genres</a>
            </h2>
        </div>
        <div className="anime-form-grid-row">
            <div className="anime-form-field-group">
                <label className="anime-form-label">Include Genres</label>
                <input
                    type="text"
                    value={genres.join(', ')}
                    onChange={onGenresChange}
                    placeholder="Action, Adventure, Drama (comma separated)"
                    className="anime-form-input"
                />
            </div>
            <div className="anime-form-field-group">
                <label className="anime-form-label">Exclude Genres</label>
                <input
                    type="text"
                    value={genresExclude.join(', ')}
                    onChange={onGenresExcludeChange}
                    placeholder="Horror, Ecchi (comma separated)"
                    className="anime-form-input"
                />
            </div>
        </div>
        <div className="anime-form-field-group">
            <label className="anime-form-label">
                Producers
                <a href="/producers" className="anime-form-link" style={{marginLeft: '10px'}}>View All Producers</a>
            </label>
            <input
                type="text"
                value={producers.join(', ')}
                onChange={onProducersChange}
                placeholder="Studio Ghibli, Madhouse, Toei Animation (comma separated)"
                className="anime-form-input"
            />
        </div>
    </div>
);

// FormActions Component
const FormActions = ({ onReset, onSubmit }) => (
    <div className="anime-form-actions">
        <button type="button" onClick={onReset} className="anime-form-reset-button">
            Reset Form
        </button>
        <button type="button" onClick={onSubmit} className="anime-form-submit-button">
            Search Anime
        </button>
    </div>
);

// Main AnimeSearchForm Component
export default function AnimeSearchForm() {
    const [q, setQ] = useState('');
    const [type, setType] = useState('');
    const [minRating, setMin] = useState('');
    const [maxRating, setMax] = useState('');
    const [status, setStatus] = useState('');
    const [rating, setRating] = useState('');
    const [sfw, setSfw] = useState(false);
    const [genres, setGenres] = useState([]);
    const [genresExclude, setGenresExclude] = useState([]);
    const [orderBy, setOrderBy] = useState('');
    const [sort, setSort] = useState('desc');
    const [producers, setProducers] = useState([]);
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const navigate = useNavigate();

    const handleQChange = (e) => setQ(e.target.value);
    const handleMinChange = (e) => setMin(e.target.value);
    const handleMaxChange = (e) => setMax(e.target.value);
    const handleTypeChange = (e) => setType(e.target.value);
    const handleStatusChange = (e) => setStatus(e.target.value);
    const handleRatingChange = (e) => setRating(e.target.value);
    const handleSfwChange = (e) => setSfw(e.target.checked);
    const handleGenresChange = (e) => setGenres(e.target.value.split(',').map(g => g.trim()));
    const handleGenresExcludeChange = (e) => setGenresExclude(e.target.value.split(',').map(g => g.trim()));
    const handleOrderByChange = (e) => setOrderBy(e.target.value);
    const handleSortChange = (e) => setSort(e.target.value);
    const handleProducersChange = (e) => setProducers(e.target.value.split(',').map(p => p.trim()));
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

    async function handleSubmit (e) {
        const formData = {
            q,
            type,
            minRating,
            maxRating,
            status,
            rating,
            sfw,
            genres,
            genresExclude,
            orderBy,
            sort,
            producers,
            start_date,
            end_date,
            page: 1 // always start from page 1
        };
        console.log('Form data:', formData);
        try {
        const data = await ApiSearch(
            q, type, minRating, maxRating, status, rating, sfw,
            genres, genresExclude, orderBy, sort, producers, start_date, end_date
        );

        // optional: persist to sessionStorage so results survive refresh
        try { 
            sessionStorage.setItem('lastApiResponse', JSON.stringify(data));
            sessionStorage.setItem('lastApiQuery', JSON.stringify(formData));
         } catch (err) { /* ignore */ }

        // navigate and pass parsed data
        navigate('/results', { state: { data } });
        } catch (err) {
        console.error(err);
        }
    };

    const resetForm = () => {
        setQ('');
        setType('');
        setMin('');
        setMax('');
        setStatus('');
        setRating('');
        setSfw(false);
        setGenres([]);
        setGenresExclude([]);
        setOrderBy('');
        setSort('desc');
        setProducers([]);
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="anime-form-container">
            <div className="anime-form-card">
                <div className="anime-form-header">
                    <h1 className="anime-form-title">Anime Search</h1>
                    <p className="anime-form-subtitle">Find your perfect anime with advanced search options</p>
                </div>

                <div className="anime-form-content">
                    <SearchSection 
                        q={q} 
                        type={type}
                        status={status}
                        onQChange={handleQChange} 
                        onTypeChange={handleTypeChange}
                        onStatusChange={handleStatusChange}
                    />
                    
                    <CompactFilters 
                        rating={rating}
                        sfw={sfw}
                        minRating={minRating}
                        maxRating={maxRating}
                        orderBy={orderBy}
                        sort={sort}
                        start_date={start_date}
                        end_date={end_date}
                        onRatingChange={handleRatingChange}
                        onSfwChange={handleSfwChange}
                        onMinChange={handleMinChange}
                        onMaxChange={handleMaxChange}
                        onOrderByChange={handleOrderByChange}
                        onSortChange={handleSortChange}
                        onStartDateChange={handleStartDateChange}
                        onEndDateChange={handleEndDateChange}
                    />
                    
                    <AdditionalFilters 
                        genres={genres}
                        genresExclude={genresExclude}
                        producers={producers}
                        onGenresChange={handleGenresChange}
                        onGenresExcludeChange={handleGenresExcludeChange}
                        onProducersChange={handleProducersChange}
                    />
                    
                    <FormActions onReset={resetForm} onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
}