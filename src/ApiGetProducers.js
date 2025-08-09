async function ApiGetProducers(page, limit, q, order_by, sort) {
    var api = "https://api.jikan.moe/v4/producers";
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (q) params.append('q', q);
    if (order_by) params.append('order_by', order_by);
    if (sort) params.append('sort', sort);
    const url = `${api}?${params.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}
export default ApiGetProducers;