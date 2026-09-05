import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import {
  createJWT,
  decodeJWT,
  verifyJWT,
  getStoredUsers,
  saveStoredUsers,
  getStoredToken,
  saveStoredToken,
  clearStoredToken,
} from '../../utils/jwt';

// Async Thunk: User Login
export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async ({ email, password, tokenDuration = 3600 }, { rejectWithValue }) => {
    try {
      // Simulate network request latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      const users = getStoredUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
      );

      if (!user) {
        return rejectWithValue('Invalid email or password. Please check your credentials.');
      }

      if (user.status === 'suspended') {
        return rejectWithValue('This account is suspended. Please contact the administrator.');
      }

      const token = createJWT(user, tokenDuration);
      saveStoredToken(token);

      const decoded = decodeJWT(token);

      return {
        token,
        user: decoded.payload,
        tokenInspection: decoded,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

// Async Thunk: User Registration
export const registerAsync = createAsyncThunk(
  'auth/registerAsync',
  async ({ name, email, password, role = 'user' }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const users = getStoredUsers();
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

      if (existing) {
        return rejectWithValue('An account with this email already exists.');
      }

      const newUser = {
        id: `usr_${nanoid(8)}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role,
        avatar: role === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
        permissions: role === 'admin'
          ? ['create_post', 'moderate_posts', 'manage_scheduled_posts', 'manage_users', 'manage_platforms', 'system_config', 'inspect_sessions']
          : ['create_post', 'publish_post', 'schedule_post', 'edit_own_post', 'delete_own_post', 'view_platforms'],
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      saveStoredUsers(updatedUsers);

      const token = createJWT(newUser, 3600);
      saveStoredToken(token);
      const decoded = decodeJWT(token);

      return {
        token,
        user: decoded.payload,
        tokenInspection: decoded,
        usersList: updatedUsers,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

// Async Thunk: Verify Stored Token on App Boot
export const verifyStoredTokenAsync = createAsyncThunk(
  'auth/verifyStoredTokenAsync',
  async (_, { rejectWithValue }) => {
    const token = getStoredToken();
    if (!token) {
      return null;
    }

    const verification = verifyJWT(token);
    if (!verification.valid) {
      clearStoredToken();
      return rejectWithValue(verification.reason || 'Session expired. Please log in again.');
    }

    const users = getStoredUsers();
    return {
      token,
      user: verification.decoded.payload,
      tokenInspection: verification.decoded,
      usersList: users,
    };
  }
);

// Async Thunk: Admin Toggle User Status
export const adminToggleUserStatusAsync = createAsyncThunk(
  'auth/adminToggleUserStatusAsync',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const users = getStoredUsers();
      const updated = users.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: nextStatus };
        }
        return u;
      });
      saveStoredUsers(updated);
      return updated;
    } catch (err) {
      return rejectWithValue('Failed to update user status');
    }
  }
);

// Async Thunk: Admin Change Role
export const adminChangeUserRoleAsync = createAsyncThunk(
  'auth/adminChangeUserRoleAsync',
  async ({ userId, newRole }, { rejectWithValue }) => {
    try {
      const users = getStoredUsers();
      const updated = users.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            role: newRole,
            permissions: newRole === 'admin'
              ? ['create_post', 'moderate_posts', 'manage_scheduled_posts', 'manage_users', 'manage_platforms', 'system_config', 'inspect_sessions']
              : ['create_post', 'publish_post', 'schedule_post', 'edit_own_post', 'delete_own_post', 'view_platforms'],
          };
        }
        return u;
      });
      saveStoredUsers(updated);
      return updated;
    } catch (err) {
      return rejectWithValue('Failed to update role');
    }
  }
);

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  usersList: [],
  tokenInspection: null,
  tokenTampered: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.tokenInspection = null;
      state.tokenTampered = false;
      state.error = null;
      clearStoredToken();
    },
    clearAuthError(state) {
      state.error = null;
    },
    refreshUsersList(state) {
      state.usersList = getStoredUsers();
    },
    tamperToken(state) {
      if (state.token) {
        // Corrupt the signature to demonstrate security rejection
        const parts = state.token.split('.');
        const tampered = `${parts[0]}.${parts[1]}.TAMPERED_INVALID_SIG`;
        state.token = tampered;
        state.tokenTampered = true;
        const result = verifyJWT(tampered);
        if (!result.valid) {
          state.error = `Security Alert: ${result.reason}`;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.tokenInspection = action.payload.tokenInspection;
        state.isAuthenticated = true;
        state.usersList = getStoredUsers();
        state.tokenTampered = false;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.tokenInspection = action.payload.tokenInspection;
        state.isAuthenticated = true;
        state.usersList = action.payload.usersList;
        state.tokenTampered = false;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });

    // Verify Stored Token
    builder
      .addCase(verifyStoredTokenAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyStoredTokenAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.tokenInspection = action.payload.tokenInspection;
          state.isAuthenticated = true;
          state.usersList = action.payload.usersList;
        }
      })
      .addCase(verifyStoredTokenAsync.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.tokenInspection = null;
        state.error = action.payload;
      });

    // Admin Toggle User Status
    builder.addCase(adminToggleUserStatusAsync.fulfilled, (state, action) => {
      state.usersList = action.payload;
    });

    // Admin Change User Role
    builder.addCase(adminChangeUserRoleAsync.fulfilled, (state, action) => {
      state.usersList = action.payload;
    });
  },
});

export const { logout, clearAuthError, refreshUsersList, tamperToken } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectAuthToken = (state) => state.auth.token;
export const selectTokenInspection = (state) => state.auth.tokenInspection;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUsersList = (state) => state.auth.usersList;
export const selectIsTokenTampered = (state) => state.auth.tokenTampered;

export default authSlice.reducer;
