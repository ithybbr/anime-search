import React, { useState, useEffect } from 'react';
import ApiGetProducers from './ApiGetProducers'; // Import your API function
import './ProducersList.css'; // Import your styles if needed
export default function ProducersList(){
    const [producers, setProducers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function fetchProducers() {
            try {
                const data = await ApiGetProducers();
                setProducers(data.data);
                console.log(data.data); // Log the producers data
            } catch (err) {
                setError("Failed to load producers");
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducers();
    }, []);

    if (loading) return <div>Loading producers...</div>;
    if (error) return <div>{error}</div>;

    return (
        <ul>
            {producers.map((producer) => (
                <li key={producer.mal_id}>{producer.titles[0].title}</li>
            ))}
        </ul>
    );
}