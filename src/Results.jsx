// src/Results.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Results.css"; // import your styles
import ApiSearch from './ApiSearch';
function ShortSynopsis({ text = "" }) {
    const [expanded, setExpanded] = useState(false);
    if (!text) return <em>No synopsis provided.</em>;

    const limit = 220;
    if (text.length <= limit) return <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>;

    return (
        <div>
        <p style={{ whiteSpace: "pre-wrap" }}>{expanded ? text : text.slice(0, limit) + "…"}</p>
        <button className="rs-readmore" onClick={() => setExpanded((s) => !s)}>
            {expanded ? "Show less" : "Read more"}
        </button>
        </div>
    );
    }

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();

    const [response, setResponse] = useState(null);
    const [query, setQuery] = useState(JSON.parse(sessionStorage.getItem("lastApiQuery"))); // the original search parameters
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    console.log("Results page loaded with query:", query);
    // Load initial response + query (from router state or sessionStorage)
    useEffect(() => {
        if (location.state?.data) {
        setResponse(location.state.data);
        setPage(location.state.data?.pagination?.current_page ?? 1);
        if (location.state?.query) {
            var query = JSON.stringify(location.state.query);
            setQuery(query);
            try { sessionStorage.setItem("lastApiQuery", query); }
            catch { console.error("Failed to save query to sessionStorage");}
        }
        try { sessionStorage.setItem("lastApiResponse", JSON.stringify(location.state.data)); } catch { console.error("Failed to save response to sessionStorage");}
        return;
        }

        // fallback to sessionStorage
        try {
        const rawRes = sessionStorage.getItem("lastApiResponse");
        const rawQuery = sessionStorage.getItem("lastApiQuery");
        if (rawRes) {
            const parsed = JSON.parse(rawRes);
            setResponse(parsed);
            setPage(parsed?.pagination?.current_page ?? 1);
        }
        if (rawQuery) setQuery(JSON.parse(rawQuery));
        } catch (err) {
        console.error("Failed to read stored response/query", err);
        }
    }, [location.state]);

    // fetch a specific page using stored query
    async function fetchPage(targetPage) {
        if (!query) {
            setError("No search parameters available to fetch results.");
            return;
        }

        setLoading(true);
        setError(null);

        // destructure query object into named params; provide defaults if missing
        const {
        q, type, minRating, maxRating, status, rating, sfw,
        genres = [], genresExclude = [], orderBy, sort, producers = [], start_date, end_date
        } = query;

        try {
        const data = await ApiSearch(
            q, type, minRating, maxRating, status, rating, sfw,
            genres, genresExclude, orderBy, sort, producers, start_date, end_date, targetPage
        );

        setResponse(data);
        setPage(targetPage);

        // persist for refresh
        try {
            sessionStorage.setItem("lastApiResponse", JSON.stringify(data));
            sessionStorage.setItem("lastApiQuery", JSON.stringify(query));
        } catch {}
        // scroll to top of results after page change
        window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch page");
        } finally {
        setLoading(false);
        }
    }

    if (!response) {
        return (
        <div className="rs-container">
            <div className="rs-empty">
            <p>No results to display. Try searching again.</p>
            <div>
                <button onClick={() => navigate(-1)}>Back to search</button>
            </div>
            {error && <p style={{ color: "crimson" }}>{error}</p>}
            </div>
        </div>
        );
    }

    const pag = response.pagination ?? {};
    const items = response.data ?? [];
    const currentPage = page ?? pag.current_page ?? 1;
    const hasNext = pag.has_next_page ?? false;
    const lastVisible = pag.last_visible_page ?? null;

return (
        <div className="rs-container">
        <header className="rs-header">
            <div>
            <h1>Search results</h1>
            <p className="rs-sub">
                Page {currentPage} {lastVisible ? `of ${lastVisible}` : ""} • {pag.items ? `${pag.items.total ?? "—"} results` : ""}
            </p>
            </div>

            <div className="rs-actions">
            <button onClick={() => navigate(-1)} disabled={loading}>Back</button>
            </div>
        </header>

        <section className="rs-grid">
            {items.map((a) => {
            const img = a.images?.jpg?.image_url || a.images?.webp?.image_url;
            const title = a.title_english || a.title;
            const genres = (a.genres || []).map((g) => g.name).join(", ");
            const studios = (a.studios || []).map((s) => s.name).join(", ");
            const producers = (a.producers || []).map((p) => p.name).join(", ");

            return (
                <article key={a.mal_id} className="rs-card">
                <a className="rs-thumb-link" href={a.url} target="_blank" rel="noreferrer">
                    <img className="rs-thumb" src={img} alt={title} loading="lazy" />
                </a>

                <div className="rs-card-body">
                    <h2 className="rs-title">
                    <a href={a.url} target="_blank" rel="noreferrer">{title}</a>
                    </h2>

                    <div className="rs-stats">
                    <span className="rs-score">★ {a.score ?? "—"}</span>
                    <span className="rs-ep">{a.type} • {a.episodes ?? "?"} ep</span>
                    <span className="rs-status">{a.status}</span>
                    </div>

                    <div className="rs-meta-row">
                    <strong className="rs-meta-label">Aired</strong>
                    <div className="rs-meta-value">{a.aired?.string ?? (a.year ? `${a.year}` : "—")}</div>
                    </div>

                    <div className="rs-meta-row">
                    <strong className="rs-meta-label">Genres</strong>
                    <div className="rs-meta-value">{genres || "—"}</div>
                    </div>

                    <div className="rs-synopsis">
                    <ShortSynopsis text={a.synopsis} />
                    </div>

                    <div className="rs-card-actions">
                    {a.trailer?.url ? (
                        <a className="rs-btn" href={a.trailer.url} target="_blank" rel="noreferrer">▶ Trailer</a>
                    ) : null}
                    <a className="rs-btn rs-btn-ghost" href={a.url} target="_blank" rel="noreferrer">View on MAL</a>
                    </div>
                </div>
                </article>
            );
            })}
        </section>

    <footer className="rs-footer">
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => fetchPage(Math.max(1, currentPage - 1))} disabled={loading || currentPage <= 1} className="rs-btn">
            Prev
        </button>

        <button onClick={() => fetchPage(currentPage + 1)} disabled={loading || !hasNext} className="rs-btn">
            Next
        </button>

        <span style={{ marginLeft: 12 }}>
            {loading ? "Loading…" : `Page ${currentPage}${lastVisible ? ` / ${lastVisible}` : ""}`}
        </span>
        </div>

        <div>
        <small>
            {pag.items ? `${pag.items.count} items on this page • ${pag.items.total} total` : ""}
            {error && <span style={{ color: "crimson", marginLeft: 10 }}> — {error}</span>}
        </small>
        </div>
    </footer>
    </div>
  );
}
