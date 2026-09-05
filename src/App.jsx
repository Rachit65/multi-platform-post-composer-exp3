import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectIsAdmin,
  verifyStoredTokenAsync,
} from './features/auth/authSlice';
import { loadPostsAsync } from './features/posts/postsSlice';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserNavbar from './components/UserNavbar';
import TokenInspector from './components/TokenInspector';
import AdminPanel from './components/AdminPanel';
import PlatformsBoard from './components/PlatformsBoard';
import PostsBoard from './components/PostsBoard';
import StoreSummary from './components/StoreSummary';

export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('composer'); // 'composer' | 'jwt-inspector' | 'admin-panel'

  useEffect(() => {
    // Verify stored JWT on boot
    dispatch(verifyStoredTokenAsync());
    // Load mock posts
    dispatch(loadPostsAsync());
  }, [dispatch]);

  // If active tab was admin-panel and user is no longer admin, reset to composer
  useEffect(() => {
    if (activeTab === 'admin-panel' && !isAdmin) {
      setActiveTab('composer');
    }
  }, [isAdmin, activeTab]);

  return (
    <div className="app-root">
      {!isAuthenticated ? (
        <main className="auth-page-wrapper">
          <div className="auth-container">
            {authView === 'login' ? (
              <LoginForm onSwitchToRegister={() => setAuthView('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setAuthView('login')} />
            )}
          </div>
        </main>
      ) : (
        <div className="authenticated-layout">
          <UserNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="app-main-content">
            {/* View 1: Main Post Composer & Redux Dashboard */}
            {activeTab === 'composer' && (
              <div className="dashboard-layout">
                <aside className="dashboard-sidebar">
                  <StoreSummary />
                </aside>
                <section className="dashboard-content">
                  <div className="dashboard-grid">
                    <PlatformsBoard />
                    <PostsBoard />
                  </div>
                </section>
              </div>
            )}

            {/* View 2: JWT Token Visualizer & Inspector */}
            {activeTab === 'jwt-inspector' && (
              <div className="tab-view-container">
                <TokenInspector />
              </div>
            )}

            {/* View 3: Admin Management Panel */}
            {activeTab === 'admin-panel' && isAdmin && (
              <div className="tab-view-container">
                <AdminPanel />
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
