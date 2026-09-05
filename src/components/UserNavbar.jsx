import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsAdmin, logout } from '../features/auth/authSlice';
import {
  LogOut,
  Shield,
  Key,
  PenTool,
  Crown,
} from 'lucide-react';

export default function UserNavbar({ activeTab, setActiveTab }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  return (
    <header className="user-navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-icon-wrap">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="brand-title flex items-center gap-2">
              <span>Post Composer</span>
              <span className="exp3-tag">Exp 3 (JWT Auth)</span>
            </div>
            <p className="brand-sub">Stateless Session & RBAC System</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-tabs">
          <button
            onClick={() => setActiveTab('composer')}
            className={`nav-tab-btn ${activeTab === 'composer' ? 'active' : ''}`}
          >
            <PenTool className="w-4 h-4" />
            <span>Composer</span>
          </button>

          <button
            onClick={() => setActiveTab('jwt-inspector')}
            className={`nav-tab-btn ${activeTab === 'jwt-inspector' ? 'active' : ''}`}
          >
            <Key className="w-4 h-4" />
            <span>JWT Inspector</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin-panel')}
              className={`nav-tab-btn admin-nav-tab ${activeTab === 'admin-panel' ? 'active' : ''}`}
            >
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="navbar-user-area">
          <div className="user-profile-badge">
            <div className="user-avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <div className="user-name flex items-center gap-1.5">
                <span>{user?.name}</span>
                <span className={`user-role-tag ${isAdmin ? 'admin' : 'user'}`}>
                  {isAdmin ? '👑 ADMIN' : 'USER'}
                </span>
              </div>
              <span className="user-email-text">{user?.email}</span>
            </div>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="logout-btn"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
