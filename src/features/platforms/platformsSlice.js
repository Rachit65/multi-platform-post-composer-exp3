import { createSlice } from '@reduxjs/toolkit';
import { Globe2, ImagePlus, Linkedin, Facebook } from 'lucide-react';

const initialState = {
  entities: {
    x: {
      id: 'x',
      name: 'X',
      mediaLimit: 4,
      icon: 'Globe2',
      accent: '#111827',
      followers: 1250,
      postsCount: 42,
    },
    linkedin: {
      id: 'linkedin',
      name: 'LinkedIn',
      mediaLimit: 9,
      icon: 'Linkedin',
      accent: '#0a66c2',
      followers: 3840,
      postsCount: 28,
    },
    instagram: {
      id: 'instagram',
      name: 'Instagram',
      mediaLimit: 10,
      icon: 'ImagePlus',
      accent: '#c13584',
      followers: 5200,
      postsCount: 156,
    },
    facebook: {
      id: 'facebook',
      name: 'Facebook',
      mediaLimit: 10,
      icon: 'Facebook',
      accent: '#1877f2',
      followers: 2100,
      postsCount: 89,
    },
  },
  ids: ['x', 'linkedin', 'instagram', 'facebook'],
  selectedPlatforms: [],
  platformLimits: {
    x: 280,
    linkedin: 3000,
    instagram: 2200,
    facebook: 63206,
  },
};

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    togglePlatform(state, action) {
      const platformId = action.payload;

      state.selectedPlatforms = state.selectedPlatforms.includes(platformId)
        ? state.selectedPlatforms.filter((id) => id !== platformId)
        : [...state.selectedPlatforms, platformId];
    },
    clearPlatforms(state) {
      state.selectedPlatforms = [];
    },
    setSelectedPlatforms(state, action) {
      state.selectedPlatforms = action.payload;
    },
  },
});

export const { clearPlatforms, setSelectedPlatforms, togglePlatform } = platformsSlice.actions;

export const selectAllPlatforms = (state) =>
  state.platforms.ids.map((id) => state.platforms.entities[id]);

export const selectPlatformById = (state, platformId) =>
  state.platforms.entities[platformId];

export const selectSelectedPlatforms = (state) =>
  state.platforms.selectedPlatforms.map((id) => state.platforms.entities[id]);

export const selectPlatformCount = (state) => state.platforms.ids.length;

export const selectPlatformLimits = (state) => state.platforms.platformLimits;

export default platformsSlice.reducer;
