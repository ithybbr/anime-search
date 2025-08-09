async function ApiSearch(q, type, minRating, maxRating, status, rating, sfw, genres, genresExclude, orderBy, sort, producers, start_date, end_date, page) {
    var api = "https://api.jikan.moe/v4/anime";
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (type) params.append('type', type);
    if (minRating) params.append('min_score', minRating);
    if (maxRating) params.append('max_score', maxRating);
    if (status) params.append('status', status);
    if (rating) params.append('rating', rating);
    if (sfw !== undefined) params.append('sfw', sfw);
    if (genres && genres.length) params.append('genres', genres.join(','));
    if (genresExclude && genresExclude.length) params.append('genres_exclude', genresExclude.join(','));
    if (orderBy) params.append('order_by', orderBy);
    if (sort) params.append('sort', sort);
    if (producers && producers.length) params.append('producers', producers.join(','));
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    if (page) params.append('page', page);

    const url = `${api}?${params.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}
export default ApiSearch;