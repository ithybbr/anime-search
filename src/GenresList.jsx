import React, { useState, useEffect } from 'react';
import ApiGetGenres from './ApiGetGenres'; // Import your API function
import './GenresList.css'; // Import your styles if needed
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

    if (loading) return <div>Loading genres...</div>;
    if (error) return <div>{error}</div>;

    return (
        <ul>
            {genres.map((genre) => (
                <li key={genre.mal_id}>{genre.name}</li>
            ))}
        </ul>
    );
}