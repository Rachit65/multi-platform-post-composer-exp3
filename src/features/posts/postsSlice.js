import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
};

// Mock async thunk to simulate loading posts from an API
export const loadPostsAsync = createAsyncThunk(
  'posts/loadPostsAsync',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Return mock posts
      return [
        {
          id: nanoid(),
          content: 'Welcome to the Redux Toolkit dashboard! This is a demo post.',
          selectedPlatforms: ['x', 'linkedin'],
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'published',
        },
        {
          id: nanoid(),
          content: 'Managing state with Redux Toolkit is now easier than ever with normalized state structure.',
          selectedPlatforms: ['linkedin', 'facebook'],
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          status: 'published',
        },
      ];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        const post = action.payload;

        state.entities[post.id] = post;
        state.ids.unshift(post.id);
      },
      prepare({ content, selectedPlatforms }) {
        return {
          payload: {
            id: nanoid(),
            content,
            selectedPlatforms,
            createdAt: new Date().toISOString(),
            status: 'draft',
          },
        };
      },
    },
    updatePost(state, action) {
      const { id, content, selectedPlatforms, status } = action.payload;

      if (state.entities[id]) {
        state.entities[id] = {
          ...state.entities[id],
          content,
          selectedPlatforms,
          ...(status && { status }),
        };
      }
    },
    deletePost(state, action) {
      const postId = action.payload;

      delete state.entities[postId];
      state.ids = state.ids.filter((id) => id !== postId);
    },
    publishPost(state, action) {
      const postId = action.payload;
      if (state.entities[postId]) {
        state.entities[postId].status = 'published';
      }
    },
    archivePost(state, action) {
      const postId = action.payload;
      if (state.entities[postId]) {
        state.entities[postId].status = 'archived';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPostsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPostsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = [];
        state.entities = {};
        
        action.payload.forEach((post) => {
          state.entities[post.id] = post;
          state.ids.push(post.id);
        });
      })
      .addCase(loadPostsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addPost, updatePost, deletePost, publishPost, archivePost } = postsSlice.actions;

export const selectAllPosts = (state) =>
  state.posts.ids.map((id) => state.posts.entities[id]);

export const selectPostById = (state, postId) => state.posts.entities[postId];

export const selectPostCount = (state) => state.posts.ids.length;

export const selectPostsByStatus = (state, status) =>
  state.posts.ids
    .map((id) => state.posts.entities[id])
    .filter((post) => post.status === status);

export const selectPostsLoading = (state) => state.posts.loading;

export default postsSlice.reducer;
