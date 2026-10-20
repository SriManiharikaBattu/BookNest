import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Profile = () => {
  const { currentUser, dbUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pin: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        street: currentUser.addresses?.[0]?.street || '',
        city: currentUser.addresses?.[0]?.city || '',
        state: currentUser.addresses?.[0]?.state || '',
        pin: currentUser.addresses?.[0]?.pin || ''
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        const token = Cookies.get('token');
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const payload = {
        name: formData.name,
        phone: formData.phone,
        addresses: [{
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pin: formData.pin
        }]
      };
      await axios.put('http://localhost:5000/api/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated! Refresh to see changes.');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmation = window.prompt("To cancel this order, type 'CANCEL' below:");
    if (confirmation === 'CANCEL') {
      try {
        const token = Cookies.get('token');
        await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Order cancelled successfully.');
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel order.');
      }
    } else {
      toast.info('Order cancellation aborted.');
    }
  };

  if (!currentUser) return <div style={{ padding: '2rem' }}>Please login.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Profile</h2>
        <button className="btn-primary" onClick={() => setIsEditing(!isEditing)} style={{ padding: '0.6rem 1.2rem', borderRadius: '25px' }}>
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: '8px', margin: '2rem 0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        {isEditing ? (
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} required />
            <input type="text" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <h4>Address Details</h4>
            <input type="text" placeholder="Street" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="PIN Code" value={formData.pin} onChange={e => setFormData({...formData, pin: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} />
            <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem', borderRadius: '25px' }}>Save Changes</button>
          </form>
        ) : (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'white', fontWeight: 'bold' }}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{currentUser.name}</h3>
              <p style={{ margin: '0.2rem 0' }}><strong>Email:</strong> {currentUser.email}</p>
              <p style={{ margin: '0.2rem 0' }}><strong>Phone:</strong> {currentUser.phone || 'Not provided'}</p>
              <p style={{ color: 'var(--pistachio)', fontWeight: 'bold', margin: '0.5rem 0' }}>Role: {currentUser.role}</p>
              {currentUser.addresses && currentUser.addresses.length > 0 && currentUser.addresses[0].street && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--cream)', borderRadius: '4px' }}>
                  <strong>Saved Address:</strong><br/>
                  {currentUser.addresses[0].street}, {currentUser.addresses[0].city}<br/>
                  {currentUser.addresses[0].state} - {currentUser.addresses[0].pin}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {currentUser.role !== 'admin' && (
        <>
          <h2>My Orders</h2>
          {loading ? <p>Loading orders...</p> : (
            orders.length === 0 ? <p>No orders found.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map(order => (
                  <div key={order._id} style={{ background: 'var(--white)', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <strong>Order ID:</strong> {order.orderId}
                        <p style={{ color: 'gray', fontSize: '0.9rem', margin: '0.2rem 0' }}>{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong>Total:</strong> ₹{order.amounts?.total?.toFixed(2)}
                        <p style={{ 
                          color: order.orderStatus === 'Cancelled' ? 'var(--cranberry)' : (order.orderStatus === 'Placed' ? 'var(--amber)' : 'var(--pistachio)'),
                          fontWeight: 'bold',
                          margin: '0.2rem 0'
                        }}>
                          Status: {order.orderStatus}
                        </p>
                      </div>
                    </div>
                    
                    {/* Tracking Timeline */}
                    <div style={{ padding: '1rem', background: 'var(--cream)', borderRadius: '8px', marginBottom: '1rem' }}>
                      <strong>Tracking:</strong>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: order.orderStatus === 'Cancelled' ? 'var(--cranberry)' : 'var(--dark-berry)' }}>
                        <span>✓ Placed</span>
                        <span>→ {order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? '✓ Shipped' : 'Shipped'}</span>
                        <span>→ {order.orderStatus === 'Delivered' ? '✓ Delivered' : 'Delivered'}</span>
                      </div>
                    </div>

                    <div>
                      {order.items.map(item => (
                        <div key={item.bookId} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
                          <span>{item.qty} x {item.title}</span>
                          <span>₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>

                    {(order.orderStatus === 'Placed' || order.orderStatus === 'Pending') && (
                      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleCancelOrder(order._id)}
                          style={{ background: 'var(--cranberry)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}

    </div>
  );
};

export default Profile;
