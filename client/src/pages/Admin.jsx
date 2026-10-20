import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Admin = () => {
  const { currentUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Add Book State
  const [newBook, setNewBook] = useState({
    title: '', author: '', price: '', discount: 0, stock: 10, format: 'Paperback', pages: '', description: '', coverImage: ''
  });

  const fetchBooks = async () => {
    try {
      const url = `http://localhost:5000/api/books?limit=100${search ? `&search=${search}` : ''}`;
      const { data } = await axios.get(url);
      setBooks(data.books);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = Cookies.get('token');
      const { data } = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
      setOrdersLoading(false);
    } catch (error) {
      console.error(error);
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      await axios.post('http://localhost:5000/api/books', newBook, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Book added successfully!');
      setNewBook({ title: '', author: '', price: '', discount: 0, stock: 10, format: 'Paperback', pages: '', description: '', coverImage: '' });
      fetchBooks();
    } catch (error) {
      toast.error('Failed to add book');
    }
  };

  const handleUpdateBook = async (id, updates) => {
    try {
      const token = Cookies.get('token');
      await axios.put(`http://localhost:5000/api/books/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Book updated successfully');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to update book');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const token = Cookies.get('token');
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Book deleted');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <div style={{ padding: '2rem' }}>Access Denied. Admins only.</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--cocoa-brown)' }}>Admin Dashboard</h1>
      
      {/* Manage Orders Section */}
      <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
        <h3>Manage User Orders</h3>
        {ordersLoading ? <p>Loading orders...</p> : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--cocoa-brown)' }}>
                  <th style={{ padding: '1rem 0' }}>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem 0' }}>{order.orderId}</td>
                    <td>{order.userId?.name || 'Unknown User'}</td>
                    <td>₹{order.amounts.total}</td>
                    <td>
                      <select 
                        value={order.orderStatus}
                        onChange={async (e) => {
                          try {
                            const token = Cookies.get('token');
                            await axios.put(`http://localhost:5000/api/orders/${order._id}/status`, { status: e.target.value }, {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            toast.success('Order status updated');
                            fetchOrders();
                          } catch (error) {
                            toast.error('Failed to update status');
                          }
                        }}
                        style={{
                          padding: '0.3rem', 
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          background: order.orderStatus === 'Cancelled' ? 'var(--cream)' : (order.orderStatus === 'Delivered' ? 'var(--pistachio)' : 'var(--white)'),
                          color: order.orderStatus === 'Delivered' ? 'white' : 'black'
                        }}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div><strong>Placed:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
                        {order.statusHistory?.map((history, i) => (
                          history.status === 'Delivered' && (
                            <div key={i}><strong>Delivered:</strong> {new Date(history.date).toLocaleDateString()}</div>
                          )
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p style={{ textAlign: 'center', margin: '2rem 0' }}>No orders found.</p>}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        {/* Add Book Form */}
        <div style={{ flex: '1 1 350px', background: 'var(--white)', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h3>Add New Book</h3>
          <form onSubmit={handleAddBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Title" required value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Author" required value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="number" placeholder="Price (₹)" required value={newBook.price} onChange={e => setNewBook({...newBook, price: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="number" placeholder="Discount (₹)" value={newBook.discount} onChange={e => setNewBook({...newBook, discount: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="number" placeholder="Stock" required value={newBook.stock} onChange={e => setNewBook({...newBook, stock: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="number" placeholder="Pages" value={newBook.pages} onChange={e => setNewBook({...newBook, pages: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            <input type="url" placeholder="Cover Image URL" required value={newBook.coverImage} onChange={e => setNewBook({...newBook, coverImage: e.target.value})} style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <textarea placeholder="Description" rows="4" value={newBook.description} onChange={e => setNewBook({...newBook, description: e.target.value})} style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button type="submit" className="btn-primary" style={{ padding: '1rem', borderRadius: '4px' }}>Add Book</button>
          </form>
        </div>

        {/* Manage Books Section */}
        <div style={{ flex: '2 1 600px', background: 'var(--white)', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Manage Books</h3>
            <input 
              type="text" 
              placeholder="Search to filter books..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.6rem 1rem', borderRadius: '25px', border: '1px solid #ccc', width: '300px', outline: 'none' }}
            />
          </div>

          {loading ? <p>Loading inventory...</p> : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--cocoa-brown)' }}>
                    <th style={{ padding: '1rem 0' }}>Book</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={book.coverImage} alt={book.title} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div>
                          <strong>{book.title}</strong>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'gray' }}>{book.author}</p>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          ₹
                          <input 
                            id={`price-${book._id}`}
                            type="number" 
                            defaultValue={book.price} 
                            style={{ width: '60px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                          <button 
                            onClick={() => {
                              const val = parseInt(document.getElementById(`price-${book._id}`).value);
                              if (val && val !== book.price) handleUpdateBook(book._id, { price: val });
                            }} 
                            style={{ background: 'var(--pistachio)', color: 'white', border: 'none', padding: '0.3rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            Save
                          </button>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input 
                            id={`stock-${book._id}`}
                            type="number" 
                            defaultValue={book.stock} 
                            style={{ width: '60px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                          <button 
                            onClick={() => {
                              const val = parseInt(document.getElementById(`stock-${book._id}`).value);
                              if (!isNaN(val) && val !== book.stock) handleUpdateBook(book._id, { stock: val });
                            }} 
                            style={{ background: 'var(--pistachio)', color: 'white', border: 'none', padding: '0.3rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            Save
                          </button>
                          <span style={{ fontSize: '0.8rem', color: book.stock === 0 ? 'var(--cranberry)' : 'gray' }}>
                            {book.stock === 0 ? 'Out of stock' : ''}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleUpdateBook(book._id, { stock: 10 })} style={{ background: 'var(--cyan)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', border: 'none', cursor: 'pointer', flex: 1 }}>
                              Stock (10)
                            </button>
                            <button onClick={() => handleUpdateBook(book._id, { stock: 0 })} style={{ background: 'var(--amber)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', border: 'none', cursor: 'pointer', flex: 1 }}>
                              Unstock
                            </button>
                          </div>
                          <button onClick={() => handleDelete(book._id)} style={{ background: 'var(--cranberry)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', border: 'none', cursor: 'pointer', width: '100%' }}>
                            Delete Book
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {books.length === 0 && <p style={{ textAlign: 'center', margin: '2rem 0' }}>No books found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
