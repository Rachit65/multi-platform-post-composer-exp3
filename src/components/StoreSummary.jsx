import React from 'react';
import { useSelector } from 'react-redux';
import { Database, FileText, Globe, TrendingUp } from 'lucide-react';
import { selectPostCount, selectPostsByStatus } from '../features/posts/postsSlice';
import { selectPlatformCount } from '../features/platforms/platformsSlice';

export default function StoreSummary() {
  const postCount = useSelector(selectPostCount);
  const platformCount = useSelector(selectPlatformCount);
  const publishedPosts = useSelector((state) =>
    selectPostsByStatus(state, 'published')
  );
  const draftPosts = useSelector((state) => selectPostsByStatus(state, 'draft'));
  const archivedPosts = useSelector((state) =>
    selectPostsByStatus(state, 'archived')
  );

  const stats = [
    {
      label: 'Total Posts',
      value: postCount,
      icon: FileText,
      color: '#3b82f6',
    },
    {
      label: 'Platforms',
      value: platformCount,
      icon: Globe,
      color: '#10b981',
    },
    {
      label: 'Published',
      value: publishedPosts.length,
      icon: TrendingUp,
      color: '#10b981',
    },
    {
      label: 'Drafts',
      value: draftPosts.length,
      icon: Database,
      color: '#f59e0b',
    },
    {
      label: 'Archived',
      value: archivedPosts.length,
      icon: Database,
      color: '#6b7280',
    },
  ];

  return (
    <div className="redux-card">
      <div className="redux-card-header">
        <div className="flex-between">
          <h2 className="redux-card-title">Redux Store Summary</h2>
          <Database size={20} color="#8f8f8f" />
        </div>
        <p className="redux-card-subtitle">Current state overview</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color }}>
                <IconComponent size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="state-details">
        <h3>State Structure (Normalized)</h3>
        <div className="state-info">
          <div className="info-row">
            <span className="info-label">posts.ids:</span>
            <span className="info-value">[{postCount} items]</span>
          </div>
          <div className="info-row">
            <span className="info-label">posts.entities:</span>
            <span className="info-value">{'{}'} normalized</span>
          </div>
          <div className="info-row">
            <span className="info-label">platforms.ids:</span>
            <span className="info-value">[{platformCount} items]</span>
          </div>
          <div className="info-row">
            <span className="info-label">platforms.entities:</span>
            <span className="info-value">{'{}'} normalized</span>
          </div>
          <div className="info-row">
            <span className="info-label">Selectors Used:</span>
            <span className="info-value">Redux Hooks (useSelector)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
