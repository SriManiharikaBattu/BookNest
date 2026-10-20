import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Logged in successfully!');
      } else {
        await signup(email, password, name);
      }
      window.location.href = '/';
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: 'var(--white)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        )}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          autoComplete="off"
          style={{ padding: '0.8rem', borderRadius: '25px', border: '1px solid #ccc', outline: 'none' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          autoComplete="new-password"
          style={{ padding: '0.8rem', borderRadius: '25px', border: '1px solid #ccc', outline: 'none' }}
        />
        <button type="submit" className="btn-primary" style={{ padding: '0.8rem', borderRadius: '25px' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        {isLogin ? (
          <p>Don't have an account? <span style={{ color: 'var(--cyan)', cursor: 'pointer' }} onClick={() => setIsLogin(false)}>Sign Up</span></p>
        ) : (
          <p>Already have an account? <span style={{ color: 'var(--cyan)', cursor: 'pointer' }} onClick={() => setIsLogin(true)}>Login</span></p>
        )}
      </div>
    </div>
  );
};

export default Login;
