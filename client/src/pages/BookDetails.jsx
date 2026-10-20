import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book', error);
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error('Please login to add to cart');
      return;
    }
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:5000/api/cart', { bookId: book._id, qty: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Added to Bag!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      toast.error('Please login to place an order');
      return;
    }
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:5000/api/cart', { bookId: book._id, qty: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/checkout');
    } catch (error) {
      toast.error('Failed to process. Please try again.');
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading book details...</div>;
  if (!book) return <div style={{ padding: '2rem' }}>Book not found</div>;

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', background: 'var(--white)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        
        {/* Images Section */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <img src={book.coverImage} alt={book.title} style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }} />
          {book.images && book.images.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {book.images.map((img, i) => (
                <img key={i} src={img} alt={`${book.title} view ${i}`} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div style={{ flex: '2 1 400px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: 'var(--cocoa-brown)' }}>{book.title}</h1>
          <h3 style={{ color: 'var(--amber)', fontSize: '1.2rem', margin: '0 0 1rem 0' }}>By {book.author}</h3>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', background: 'var(--cream)', padding: '1rem', borderRadius: '8px' }}>
            <div><strong>Rating:</strong> ⭐ {book.rating || '4.5'} / 5</div>
            <div><strong>Format:</strong> {book.format || 'Paperback'}</div>
            <div><strong>Pages:</strong> {book.pages || 'N/A'}</div>
            <div><strong>Language:</strong> {book.language || 'English'}</div>
          </div>

          <p style={{ margin: '1rem 0', lineHeight: '1.6', fontSize: '1.05rem', color: '#555' }}>
            {book.description}
          </p>
          
          <div style={{ margin: '2rem 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '2rem', color: 'var(--crimson)' }}>
              ₹{book.price - (book.discount || 0)}
            </span>
            {book.discount > 0 && (
              <span style={{ textDecoration: 'line-through', color: 'gray', fontSize: '1.2rem' }}>
                ₹{book.price}
              </span>
            )}
            {book.discount > 0 && (
              <span style={{ background: 'var(--golden-wheat)', color: 'var(--cocoa-brown)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Save ₹{book.discount}
              </span>
            )}
          </div>

          <div style={{ margin: '1rem 0' }}>
            <span style={{ 
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '25px',
              background: book.stock > 0 ? 'var(--pistachio)' : 'var(--cranberry)',
              color: 'var(--white)',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              {book.stock > 0 ? (book.stock < 10 ? `Only ${book.stock} left in stock!` : 'In Stock & Ready to Ship') : 'Out of Stock'}
            </span>
          </div>

          {(!currentUser || currentUser.role !== 'admin') && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn-primary" 
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                style={{ 
                  padding: '1rem 2.5rem', 
                  fontSize: '1.2rem', 
                  borderRadius: '30px',
                  opacity: book.stock === 0 ? 0.5 : 1,
                  boxShadow: '0 4px 6px rgba(209, 23, 34, 0.3)'
                }}
              >
                Add to Bag
              </button>
              
              <button 
                onClick={handleBuyNow}
                disabled={book.stock === 0}
                style={{ 
                  padding: '1rem 2.5rem', 
                  fontSize: '1.2rem', 
                  borderRadius: '30px',
                  background: 'var(--amber)',
                  color: 'white',
                  border: 'none',
                  cursor: book.stock === 0 ? 'not-allowed' : 'pointer',
                  opacity: book.stock === 0 ? 0.5 : 1,
                  boxShadow: '0 4px 6px rgba(223, 155, 27, 0.3)',
                  fontWeight: 'bold'
                }}
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
