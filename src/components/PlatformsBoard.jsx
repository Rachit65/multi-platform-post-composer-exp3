import React from 'react';
import { useSelector } from 'react-redux';
import { Globe2, Linkedin, ImagePlus, Facebook, Users, Share2 } from 'lucide-react';
import { selectAllPlatforms } from '../features/platforms/platformsSlice';

const iconMap = {
  Globe2: Globe2,
  Linkedin: Linkedin,
  ImagePlus: ImagePlus,
  Facebook: Facebook,
};

export default function PlatformsBoard() {
  const platforms = useSelector(selectAllPlatforms);

  return (
    <div className="redux-card">
      <div className="redux-card-header">
        <h2 className="redux-card-title">Available Platforms</h2>
        <p className="redux-card-subtitle">from Redux state</p>
      </div>
      <div className="platforms-grid">
        {platforms.map((platform) => {
          const IconComponent = iconMap[platform.icon];
          return (
            <div key={platform.id} className="platform-item">
              <div className="platform-header">
                <div
                  className="platform-icon"
                  style={{ backgroundColor: platform.accent }}
                >
                  {IconComponent && <IconComponent size={20} color="white" />}
                </div>
                <div className="platform-meta">
                  <h3>{platform.name}</h3>
                  <p className="platform-id">@{platform.id}</p>
                </div>
              </div>
              <div className="platform-stats">
                <div className="stat">
                  <Users size={14} />
                  <span>{platform.followers.toLocaleString()} followers</span>
                </div>
                <div className="stat">
                  <Share2 size={14} />
                  <span>{platform.postsCount} posts</span>
                </div>
              </div>
              <div className="platform-footer">
                <span className="badge">Media Limit: {platform.mediaLimit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
