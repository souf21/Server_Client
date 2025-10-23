import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js'; 
import { supabase } from './supabaseClient';



function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('login'); 
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      alert('Logged in successfully!');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      alert('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>{view === 'login' ? 'Login' : 'Sign Up'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={view === 'login' ? handleLogin : handleSignUp}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : (view === 'login' ? 'Login' : 'Sign Up')}
        </button>
      </form>
      <p>
        {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
        <button onClick={() => setView(view === 'login' ? 'signup' : 'login')}>
          {view === 'login' ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default Auth;