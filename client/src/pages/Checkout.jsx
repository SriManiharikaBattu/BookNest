import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { translations } from '../translations';

const Checkout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: '', city: '', state: '', pin: '' });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cart, setCart] = useState(null);

  const userLang = currentUser?.preferredLanguage || 'English';
  const t = translations[userLang] || translations['English'];

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = Cookies.get('token');
        const { data } = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart', error);
      }
    };
    fetchCart();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:5000/api/orders', {
        address,
        paymentMethod,
        upiTransactionId: paymentMethod === 'UPI' ? `TXN${Date.now()}` : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(userLang === 'English' ? 'Order placed successfully!' : (userLang === 'Hindi' ? 'ऑर्डर सफलतापूर्वक दिया गया!' : 'ఆర్డర్ విజయవంతంగా చేయబడింది!'));
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    }
  };

  if (!cart) return <div>Loading...</div>;

  let subtotal = 0;
  cart.items.forEach(item => {
    subtotal += (item.bookId.price - (item.bookId.discount || 0)) * item.qty;
  });
  const gst = subtotal * 0.05;
  const delivery = subtotal > 500 ? 0 : 50;
  const total = subtotal + gst + delivery;

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      
      {/* Checkout Form */}
      <div style={{ flex: '1 1 500px' }}>
        <h2>{t.checkout}</h2>
        
        <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: '8px', margin: '1rem 0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>{t.shippingAddress}</h3>
          <input placeholder="Street" onChange={e => setAddress({...address, street: e.target.value})} style={{ display: 'block', width: '100%', margin: '1rem 0', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input placeholder="City" onChange={e => setAddress({...address, city: e.target.value})} style={{ display: 'block', width: '100%', margin: '1rem 0', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input placeholder="State" onChange={e => setAddress({...address, state: e.target.value})} style={{ display: 'block', width: '100%', margin: '1rem 0', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          <input placeholder="PIN Code" onChange={e => setAddress({...address, pin: e.target.value})} style={{ display: 'block', width: '100%', margin: '1rem 0', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: '8px', margin: '1rem 0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>{t.paymentMethod}</h3>
          <select onChange={e => setPaymentMethod(e.target.value)} value={paymentMethod} style={{ display: 'block', width: '100%', margin: '1rem 0', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="UPI">UPI (GPay, PhonePe, Paytm)</option>
            <option value="COD">Cash on Delivery</option>
          </select>
          
          {paymentMethod === 'UPI' && (
            <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Dynamic QR Code Section */}
              <div style={{ textAlign: 'center', background: 'var(--cream)', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
                <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', color: 'var(--cocoa-brown)' }}>Scan QR to Pay ₹{total.toFixed(2)}</p>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=booknest@ybl&pn=BookNest&am=${total.toFixed(2)}&cu=INR`)}`} 
                  alt="UPI QR Code"
                  style={{ width: '150px', height: '150px', borderRadius: '8px', border: '4px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                />
                <p style={{ margin: '1rem 0 0 0', fontSize: '0.85rem', color: 'gray' }}>Scan with any app (GPay, PhonePe, Paytm)</p>
              </div>

              <p style={{ margin: '0.5rem 0', textAlign: 'center', color: 'gray', fontSize: '0.9rem' }}>- OR PAY ON DEVICE -</p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a 
                  href={`phonepe://pay?pa=booknest@ybl&pn=BookNest&am=${total.toFixed(2)}&cu=INR`}
                  style={{ flex: 1, textAlign: 'center', padding: '0.8rem', background: '#5f259f', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', minWidth: '100px', boxShadow: '0 2px 4px rgba(95, 37, 159, 0.3)' }}
                >
                  PhonePe
                </a>
                <a 
                  href={`tez://upi/pay?pa=booknest@ybl&pn=BookNest&am=${total.toFixed(2)}&cu=INR`}
                  style={{ flex: 1, textAlign: 'center', padding: '0.8rem', background: '#4285F4', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', minWidth: '100px', boxShadow: '0 2px 4px rgba(66, 133, 244, 0.3)' }}
                >
                  GPay
                </a>
                <a 
                  href={`paytmmp://pay?pa=booknest@ybl&pn=BookNest&am=${total.toFixed(2)}&cu=INR`}
                  style={{ flex: 1, textAlign: 'center', padding: '0.8rem', background: '#00BAF2', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', minWidth: '100px', boxShadow: '0 2px 4px rgba(0, 186, 242, 0.3)' }}
                >
                  Paytm
                </a>
              </div>
              
              <input placeholder="Enter UPI ID (e.g., user@upi) for verification" value={upiId} onChange={e => setUpiId(e.target.value)} style={{ display: 'block', width: '100%', padding: '0.8rem', borderRadius: '25px', border: '1px solid #ccc', outline: 'none', marginTop: '0.5rem' }} />
            </div>
          )}
        </div>

        <button onClick={handlePlaceOrder} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', borderRadius: '25px', marginTop: '1rem' }}>
          {t.placeOrder}
        </button>
      </div>

      {/* Order Summary & Photos */}
      <div style={{ flex: '1 1 350px' }}>
        <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: '8px', margin: '3.7rem 0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0' }}>{t.orderSummary}</h3>
          
          {/* Display Items with Photos */}
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
            {cart.items.map(item => (
              <div key={item.bookId._id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <img src={item.bookId.coverImage} alt={item.bookId.title} style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                <div>
                  <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1rem' }}>{item.bookId.title}</h4>
                  <p style={{ margin: 0, color: 'gray', fontSize: '0.9rem' }}>Qty: {item.qty}</p>
                  <p style={{ margin: '0.2rem 0', fontWeight: 'bold' }}>₹{(item.bookId.price - (item.bookId.discount || 0)) * item.qty}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', color: 'gray' }}>
            <span>{t.subtotal}</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', color: 'gray' }}>
            <span>GST (5%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0', color: 'gray' }}>
            <span>{t.delivery}</span>
            <span>{delivery === 0 ? 'FREE' : `₹${delivery.toFixed(2)}`}</span>
          </div>
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #eee' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.3rem', color: 'var(--cocoa-brown)' }}>
            <span>{t.total}</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
