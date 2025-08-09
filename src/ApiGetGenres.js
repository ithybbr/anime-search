async function ApiGetGenres(type) {
    var api = "https://api.jikan.moe/v4/genres/anime";
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    const url = `${api}?${params.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}
export default ApiGetGenres;