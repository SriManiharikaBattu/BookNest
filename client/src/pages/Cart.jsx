import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { translations } from '../translations';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  const userLang = currentUser?.preferredLanguage || 'English';
  const t = translations[userLang] || translations['English'];

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const token = Cookies.get('token');
        const { data } = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart', error);
        setLoading(false);
      }
    };
    fetchCart();
  }, [currentUser]);

  const handleUpdateQty = async (bookId, qty) => {
    try {
      const token = Cookies.get('token');
      const { data } = await axios.put(`http://localhost:5000/api/cart/${bookId}`, { qty }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      const token = Cookies.get('token');
      const { data } = await axios.delete(`http://localhost:5000/api/cart/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!currentUser) {
    return <div style={{ padding: '2rem' }}>Please <Link to="/login">{t.login}</Link></div>;
  }

  if (loading) return <div>Loading...</div>;

  if (!cart || cart.items.length === 0) {
    return <div style={{ padding: '2rem' }}>{t.emptyBag} <Link to="/">Home</Link></div>;
  }

  let subtotal = 0;
  cart.items.forEach(item => {
    subtotal += (item.bookId.price - (item.bookId.discount || 0)) * item.qty;
  });

  const gst = subtotal * 0.05;
  const delivery = subtotal > 500 ? 0 : 50;
  const total = subtotal + gst + delivery;

  return (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '2 1 600px' }}>
        <h2>{t.yourBag}</h2>
        {cart.items.map(item => (
          <div key={item.bookId._id} style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc', alignItems: 'center' }}>
            <img src={item.bookId.coverImage} alt={item.bookId.title} style={{ width: '80px', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
            <div style={{ flex: 1 }}>
              <Link to={`/book/${item.bookId._id}`} style={{ fontWeight: 'bold', color: 'var(--dark-berry)', textDecoration: 'none' }}>
                {item.bookId.title}
              </Link>
              <p style={{ color: 'var(--amber)', margin: '0.2rem 0' }}>{item.bookId.author}</p>
              <p style={{ fontWeight: 'bold' }}>₹{item.bookId.price - (item.bookId.discount || 0)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => handleUpdateQty(item.bookId._id, Math.max(1, item.qty - 1))} style={{ padding: '0.5rem', cursor: 'pointer', border: '1px solid #ccc', background: 'white' }}>-</button>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
              <button onClick={() => handleUpdateQty(item.bookId._id, item.qty + 1)} style={{ padding: '0.5rem', cursor: 'pointer', border: '1px solid #ccc', background: 'white' }}>+</button>
            </div>
            <button onClick={() => handleRemove(item.bookId._id)} style={{ color: 'var(--cranberry)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginLeft: '1rem' }}>
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ flex: '1 1 300px', background: 'var(--white)', padding: '2rem', borderRadius: '8px', height: 'fit-content', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h3>{t.orderSummary}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', color: 'gray' }}>
          <span>{t.subtotal}</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', color: 'gray' }}>
          <span>GST (5%)</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', color: 'gray' }}>
          <span>{t.delivery}</span>
          <span>{delivery === 0 ? 'FREE' : `₹${delivery.toFixed(2)}`}</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <span>{t.total}</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', borderRadius: '25px', textDecoration: 'none' }}>
          {t.checkout}
        </Link>
      </div>
    </div>
  );
};

export default Cart;
