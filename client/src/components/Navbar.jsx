import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, LogOut, BookOpen, Globe } from 'lucide-react';
import { translations } from '../translations';
import Cookies from 'js-cookie';

const Navbar = () => {
  const { currentUser, logout, dbUser, updateLanguage, syncLanguageCookie } = useAuth();
  const navigate = useNavigate();

  const userLang = currentUser?.preferredLanguage || 'English';
  const t = translations[userLang] || translations['English'];

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav style={{
      background: 'var(--cocoa-brown)',
      color: 'var(--white)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ color: 'var(--golden-wheat)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
        <BookOpen /> BookNest
      </Link>
      
      <div style={{ flex: 1, margin: '0 2rem' }}>
        <input 
          type="text" 
          placeholder={t.searchPlaceholder} 
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: 'none',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
            <Globe size={16} />
            <select 
              value={userLang} 
              onChange={async (e) => {
                const selected = e.target.value;
                await updateLanguage(selected);
                syncLanguageCookie(selected);
                window.location.reload();
              }}
              style={{ background: 'transparent', color: 'var(--white)', border: 'none', outline: 'none', cursor: 'pointer' }}
            >
              <option value="English" style={{ color: 'black' }}>English</option>
              <option value="Telugu" style={{ color: 'black' }}>తెలుగు</option>
              <option value="Hindi" style={{ color: 'black' }}>हिंदी</option>
            </select>
          </div>
        )}

        {(!currentUser || currentUser.role !== 'admin') && (
          <Link to="/cart" style={{ color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
            <ShoppingBag size={20} /> {t.bag}
          </Link>
        )}
        
        {currentUser ? (
          <>
            <Link to="/profile" style={{ color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
              <User size={20} /> {t.profile}
            </Link>
            {dbUser?.role === 'admin' && (
              <Link to="/admin" style={{ color: 'var(--pistachio)', textDecoration: 'none', fontWeight: 'bold' }}>
                {t.adminPanel}
              </Link>
            )}
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: 0, cursor: 'pointer' }}>
              <LogOut size={20} /> {t.logout}
            </button>
          </>
        ) : (
          <Link to="/login" style={{ 
            background: 'linear-gradient(135deg, var(--crimson), var(--cranberry))',
            color: 'var(--white)',
            padding: '0.6rem 1.5rem',
            borderRadius: '25px',
            fontWeight: 'bold',
            textDecoration: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
            display: 'inline-block'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {t.login}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
