import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, CheckCircle2, Archive, Copy } from 'lucide-react';
import {
  selectAllPosts,
  selectPostsLoading,
  addPost,
  updatePost,
  deletePost,
  publishPost,
  archivePost,
} from '../features/posts/postsSlice';
import { selectPlatformLimits } from '../features/platforms/platformsSlice';
import { PLATFORM_DETAILS } from './platformConfig';

export default function PostsBoard() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const loading = useSelector(selectPostsLoading);
  const platformLimits = useSelector(selectPlatformLimits);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    selectedPlatforms: [],
  });

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({ content: '', selectedPlatforms: [] });
  };

  const handleEdit = (post) => {
    setIsCreating(false);
    setEditingId(post.id);
    setFormData({
      content: post.content,
      selectedPlatforms: post.selectedPlatforms,
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ content: '', selectedPlatforms: [] });
  };

  const handleSave = () => {
    if (!formData.content.trim() || formData.selectedPlatforms.length === 0) {
      alert('Please fill in content and select at least one platform');
      return;
    }

    if (editingId) {
      dispatch(
        updatePost({
          id: editingId,
          content: formData.content,
          selectedPlatforms: formData.selectedPlatforms,
        })
      );
    } else {
      dispatch(
        addPost({
          content: formData.content,
          selectedPlatforms: formData.selectedPlatforms,
        })
      );
    }

    setIsCreating(false);
    setEditingId(null);
    setFormData({ content: '', selectedPlatforms: [] });
  };

  const handleTogglePlatform = (platformId) => {
    setFormData((prev) => ({
      ...prev,
      selectedPlatforms: prev.selectedPlatforms.includes(platformId)
        ? prev.selectedPlatforms.filter((id) => id !== platformId)
        : [...prev.selectedPlatforms, platformId],
    }));
  };

  const handlePublish = (postId) => {
    dispatch(publishPost(postId));
  };

  const handleArchive = (postId) => {
    dispatch(archivePost(postId));
  };

  const handleDelete = (postId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(postId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return '#10b981';
      case 'draft':
        return '#f59e0b';
      case 'archived':
        return '#6b7280';
      default:
        return '#8f8f8f';
    }
  };

  return (
    <div className="redux-card">
      <div className="redux-card-header">
        <h2 className="redux-card-title">Posts Board</h2>
        <button
          onClick={handleCreateNew}
          disabled={isCreating || editingId}
          className="button-primary"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <p>Loading posts from Redux store...</p>
        </div>
      )}

      {isCreating || editingId ? (
        <div className="post-form">
          <h3>{editingId ? 'Edit Post' : 'Create New Post'}</h3>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Write your post content here..."
            className="form-textarea"
            rows={4}
          />

          <div className="platform-selector-form">
            <label>Select Platforms:</label>
            <div className="platforms-checkboxes">
              {Object.entries(PLATFORM_DETAILS).map(([key, platform]) => (
                <label key={key} className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={formData.selectedPlatforms.includes(key)}
                    onChange={() => handleTogglePlatform(key)}
                  />
                  <span>{platform.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button onClick={handleSave} className="button-primary">
              Save Post
            </button>
            <button onClick={handleCancel} className="button-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="posts-list">
          {posts.length === 0 ? (
            <p className="empty-state">
              No posts yet. Click "New Post" to create one.
            </p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post-item">
                <div className="post-header">
                  <div className="post-meta">
                    <span
                      className="post-status-badge"
                      style={{
                        backgroundColor: getStatusColor(post.status),
                      }}
                    >
                      {post.status}
                    </span>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="post-actions">
                    {post.status !== 'published' && (
                      <button
                        onClick={() => handlePublish(post.id)}
                        className="action-button"
                        title="Publish"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                    {post.status !== 'archived' && (
                      <button
                        onClick={() => handleArchive(post.id)}
                        className="action-button"
                        title="Archive"
                      >
                        <Archive size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(post)}
                      className="action-button"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="action-button action-button-danger"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="post-content">
                  <p>{post.content}</p>
                </div>

                <div className="post-platforms">
                  {post.selectedPlatforms.map((platformId) => (
                    <span
                      key={platformId}
                      className="platform-badge"
                      style={{
                        borderColor:
                          PLATFORM_DETAILS[platformId]?.accent || '#ccc',
                      }}
                    >
                      {PLATFORM_DETAILS[platformId]?.name || platformId}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
