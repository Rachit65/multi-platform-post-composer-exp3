import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerAsync, selectAuthLoading, selectAuthError, clearAuthError } from '../features/auth/authSlice';
import { UserPlus, User, Mail, Lock, Shield, AlertCircle } from 'lucide-react';

export default function RegisterForm({ onSwitchToLogin }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [validationMsg, setValidationMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationMsg('');

    if (password.length < 6) {
      setValidationMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationMsg('Passwords do not match.');
      return;
    }

    dispatch(registerAsync({ name, email, password, role }));
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-icon-badge">
          <UserPlus className="w-6 h-6 text-green-500" />
        </div>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Register a new user to generate a signed JWT session token</p>
      </div>

      {(error || validationMsg) && (
        <div className="auth-error-banner">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error || validationMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="reg-name">
            <User className="w-4 h-4" /> Full Name
          </label>
          <input
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            required
            className="auth-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">
            <Mail className="w-4 h-4" /> Email Address
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            className="auth-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-role">
            <Shield className="w-4 h-4" /> Account Role
          </label>
          <select
            id="reg-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="auth-select"
          >
            <option value="user">User Role (Standard Publishing Access)</option>
            <option value="admin">Admin Role (Full System & User Control)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="form-group">
            <label htmlFor="reg-pass">
              <Lock className="w-4 h-4" /> Password
            </label>
            <input
              id="reg-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">
              <Lock className="w-4 h-4" /> Confirm
            </label>
            <input
              id="reg-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="auth-input"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary auth-submit-btn">
          {loading ? (
            <span className="loading-spinner">Creating Account...</span>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" /> Register & Sign In
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <span>Already have an account?</span>
        <button
          type="button"
          onClick={() => {
            dispatch(clearAuthError());
            onSwitchToLogin();
          }}
          className="switch-auth-btn"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
