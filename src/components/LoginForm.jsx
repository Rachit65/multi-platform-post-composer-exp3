import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync, selectAuthLoading, selectAuthError, clearAuthError } from '../features/auth/authSlice';
import { Shield, Lock, Mail, Key, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginForm({ onSwitchToRegister }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState('admin@composer.com');
  const [password, setPassword] = useState('admin123');
  const [duration, setDuration] = useState(3600); // 1 hour default

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginAsync({ email, password, tokenDuration: Number(duration) }));
  };

  const handleQuickLogin = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    dispatch(clearAuthError());
    dispatch(loginAsync({ email: roleEmail, password: rolePass, tokenDuration: Number(duration) }));
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-icon-badge">
          <Shield className="w-6 h-6 text-blue-500" />
        </div>
        <h2>Sign In to Post Composer</h2>
        <p className="auth-subtitle">
          Stateless token-based authentication with JSON Web Tokens (JWT) & Role-Based Access Control
        </p>
      </div>

      {error && (
        <div className="auth-error-banner">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Demo Login Credentials */}
      <div className="demo-accounts-box">
        <div className="demo-accounts-title">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Demo Login:</span>
        </div>
        <div className="demo-buttons-grid">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@composer.com', 'admin123')}
            className="demo-btn admin-demo-btn"
          >
            <span className="demo-role-badge admin-badge">Admin Role</span>
            <span className="demo-email">admin@composer.com</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('user@composer.com', 'user123')}
            className="demo-btn user-demo-btn"
          >
            <span className="demo-role-badge user-badge">User Role</span>
            <span className="demo-email">user@composer.com</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="login-email">
            <Mail className="w-4 h-4" /> Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) dispatch(clearAuthError());
            }}
            placeholder="name@example.com"
            required
            className="auth-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">
            <Lock className="w-4 h-4" /> Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) dispatch(clearAuthError());
            }}
            placeholder="••••••••"
            required
            className="auth-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="token-duration">
            <Key className="w-4 h-4" /> JWT Token Expiration
          </label>
          <select
            id="token-duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="auth-select"
          >
            <option value={300}>5 Minutes (Fast Expiry Testing)</option>
            <option value={3600}>1 Hour (Standard Session)</option>
            <option value={86400}>24 Hours (Extended Session)</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn-primary auth-submit-btn">
          {loading ? (
            <span className="loading-spinner">Signing In...</span>
          ) : (
            <>
              <UserCheck className="w-4 h-4 mr-2" /> Sign In & Generate JWT
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <span>Need a new account?</span>
        <button
          type="button"
          onClick={() => {
            dispatch(clearAuthError());
            onSwitchToRegister();
          }}
          className="switch-auth-btn"
        >
          Create an Account
        </button>
      </div>
    </div>
  );
}
