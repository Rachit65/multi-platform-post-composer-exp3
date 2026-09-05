import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postsReducer from '../features/posts/postsSlice';
import platformsReducer from '../features/platforms/platformsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    platforms: platformsReducer,
  },
});
