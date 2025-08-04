import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Theatres.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// This will be dynamically generated based on admin name
const getPlaceholderImg = (adminName) => {
  const name = adminName || 'Admin';
  return `https://ui-avatars.com/api/?background=FFD6A0&color=232323&name=${encodeURIComponent(name)}`;
};

const Theatre = () => {
  const { theatreId } = useParams();
  const [theatre, setTheatre] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch theatre details
        const tRes = await fetch(`${API_URL}/api/admin/all-theatres`);
        const tData = await tRes.json();
        const found = tData.theatres.find(t => t.name === decodeURIComponent(theatreId));
        setTheatre(found);
        // Admin data is already populated in the theatre object
        if (found && found.admin) {
          setAdmin(found.admin);
        }
        // Fetch shows for this theatre
        const sRes = await fetch(`${API_URL}/api/show/all`);
        const sData = await sRes.json();
        const filteredShows = sData.shows.filter(show => show.theatre === found?._id);
        setShows(filteredShows);
        setLoading(false);
      } catch (e) {
        setError('Failed to load theatre details.');
        setLoading(false);
      }
    }
    fetchData();
  }, [theatreId]);

  if (loading) return <div className="theatres-loading">Loading theatre...</div>;
  if (error || !theatre) return <div className="theatres-error">{error || 'Theatre not found.'}</div>;

  return (
    <div className="theatre-detail-container">
      <div className="theatre-detail-header">
        <img className="theatre-detail-image" src={admin?.image || getPlaceholderImg(admin?.name)} alt="Theatre" />
        <div className="theatre-detail-header-info">
          <h1 className="theatre-detail-title">{theatre.name}</h1>
          <div className="theatre-detail-admin">Admin: {admin?.name || (theatre.admin.slice(0,8)+'...')}</div>
        </div>
      </div>
      <div className="theatre-detail-layout-block">
        <div className="theatre-detail-layout-label">Layout</div>
        <div className="theatre-detail-layout-grid">
          {theatre.layout && theatre.layout.map((row, i) => (
            <div className="theatre-detail-layout-row" key={i}>
              {row.map((seat, j) => (
                <span className={`theatre-detail-layout-seat${seat ? '' : ' theatre-detail-layout-seat-empty'}`} key={j}>{seat ? '🟩' : '⬜'}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="theatre-detail-shows-block">
        <h2 className="theatre-detail-shows-title">Currently Airing Shows</h2>
        {shows.length === 0 ? (
          <div className="theatre-detail-no-shows">No shows currently airing in this theatre.</div>
        ) : (
          <ul className="theatre-detail-shows-list">
            {shows.map(show => (
              <li className="theatre-detail-show-item" key={show._id}>
                <b>{show.movie?.title || 'Untitled Movie'}</b> <span className="theatre-detail-show-time">{new Date(show.showDateTime).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Theatre; 