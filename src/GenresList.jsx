import React, { useState, useEffect } from 'react';
import ApiGetGenres from './ApiGetGenres'; // Import your API function
import './GenresList.css'; // Import your styles

export default function GenresList(){
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchGenres() {
            try {
                const data = await ApiGetGenres();
                setGenres(data.data);
            } catch (err) {
                setError("Failed to load genres");
            } finally {
                setLoading(false);
            }
        }
        fetchGenres();
    }, []);

    if (loading) 
        return (
            <div className="genres-container">
                <div className="loading">Loading genres...</div>
            </div>
        );
    if (error) 
        return (
            <div className="genres-container">
                <div className="error">{error}</div>
            </div>
        );

    return (
        <div className="genres-container">
            <h1 className="genres-title">
                <a href='/' className="pagination-btn" style={{display: 'table'}}>Back to Search</a>
                Anime Genres
            </h1>
            <ul className="genres-list">
                {genres.map((genre) => (
                    <li key={genre.mal_id} className="genre-item">
                        {genre.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}