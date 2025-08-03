import React, { useEffect, useState } from 'react';
import './Theatres.css';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/admin/all-theatres`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTheatres(data.theatres);
        } else {
          setError(data.message || 'Failed to fetch theatres');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch theatres');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="theatres-loading">Loading theatres...</div>;
  if (error) return <div className="theatres-error">{error}</div>;

  return (
    <div className="theatres-container">
      <h1 className="theatres-title">All Theatres</h1>
      <div style={{textAlign: 'center', color: '#bbb', fontSize: '1.15rem', marginBottom: 24, marginTop: -18, letterSpacing: '0.01em'}}>
        Explore our partner theatres and their unique layouts across cities.
      </div>
      <div className="theatres-list">
        {theatres.map(theatre => (
          <div className="theatre-card" key={theatre._id} onClick={() => navigate(`/theatres/${encodeURIComponent(theatre.name)}`)} style={{cursor:'pointer'}}>
            <h2 className="theatre-name">{theatre.name}</h2>
            <div className="theatre-meta">
              <span className="theatre-admin">Admin: {theatre.admin?.name || theatre.admin?.slice(0, 8) + '...'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Theatres; 