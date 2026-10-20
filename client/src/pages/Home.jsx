import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { translations } from '../translations';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const { currentUser } = useAuth();
  
  const userLang = currentUser?.preferredLanguage || 'English';
  const t = translations[userLang] || translations['English'];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let url = 'http://localhost:5000/api/books?limit=50';
        if (currentUser) {
          if (search) url += `&search=${search}`;
          if (genre) url += `&genre=${genre}`;
          if (language) url += `&language=${language}`;
        }
        const { data } = await axios.get(url);
        setBooks(data.books);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books', error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, [search, genre, language, currentUser]);

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ 
        background: 'linear-gradient(to right, var(--deep-plum), var(--cocoa-brown))', 
        color: 'var(--white)', 
        padding: '3rem 2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1>{t.welcome}</h1>
        <p>{t.discover}</p>
      </header>

      {currentUser && (
        <div style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>{t.filters}</h3>
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1, minWidth: '200px' }}
          />
          <select 
            value={genre} 
            onChange={(e) => setGenre(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">{t.allGenres}</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Science Fiction">Sci-Fi</option>
            <option value="Classic">Classics</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Poetry">Poetry</option>
          </select>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">{t.allLanguages}</option>
            <option value="English">English</option>
            <option value="Telugu">Telugu</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>
      )}

      <h2>{currentUser && (search || genre || language) ? t.searchResults : t.featuredBooks}</h2>
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found matching your criteria.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginTop: '1rem'
        }}>
          {books.map(book => (
            <div key={book._id} style={{
              background: 'var(--white)',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              {book.stock <= 0 && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--cranberry)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem', zIndex: 10 }}>
                  Out of Stock
                </div>
              )}
              <img 
                src={book.coverImage} 
                alt={book.title} 
                style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '4px', opacity: book.stock <= 0 ? 0.6 : 1 }} 
              />
              <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{book.title}</h3>
              <p style={{ color: 'var(--amber)', fontSize: '0.9rem' }}>{book.author}</p>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>₹{book.price - (book.discount || 0)}</span>
                <Link to={`/book/${book._id}`} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                  {t.view}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
