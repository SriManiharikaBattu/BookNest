import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Maps to MongoDB user
  const [loading, setLoading] = useState(true);

  const syncLanguageCookie = (lang) => {
    if (lang === 'English') {
      Cookies.remove('googtrans');
      Cookies.remove('googtrans', { path: '/' });
      Cookies.remove('googtrans', { path: '/', domain: 'localhost' });
      Cookies.remove('googtrans', { path: '/', domain: '.localhost' });
    } else {
      const codeMap = { 'Telugu': 'te', 'Hindi': 'hi' };
      const code = codeMap[lang] || 'en';
      Cookies.set('googtrans', `/en/${code}`, { path: '/' });
      Cookies.set('googtrans', `/en/${code}`, { path: '/', domain: 'localhost' });
      Cookies.set('googtrans', `/en/${code}`, { path: '/', domain: '.localhost' });
    }
  };

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(res.data);
          syncLanguageCookie(res.data.preferredLanguage || 'English');
        } catch (error) {
          console.error("Session expired or invalid:", error);
          Cookies.remove('token');
          syncLanguageCookie('English');
        }
      } else {
        syncLanguageCookie('English');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    Cookies.set('token', res.data.token, { expires: 30 });
    syncLanguageCookie(res.data.preferredLanguage || 'English');
    setCurrentUser(res.data);
  };
  
  const signup = async (email, password, name) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { email, password, name });
    Cookies.set('token', res.data.token, { expires: 30 });
    syncLanguageCookie('English');
    setCurrentUser(res.data);
  };
  
  const logout = () => {
    Cookies.remove('token');
    syncLanguageCookie('English');
    setCurrentUser(null);
  };

  const updateLanguage = async (lang) => {
    try {
      const token = Cookies.get('token');
      const res = await axios.put('http://localhost:5000/api/auth/profile', { preferredLanguage: lang }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(res.data);
    } catch (error) {
      console.error('Failed to update language', error);
    }
  };

  const value = {
    currentUser,
    dbUser: currentUser,
    login,
    signup,
    logout,
    updateLanguage,
    syncLanguageCookie
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
