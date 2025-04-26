import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Import the userReducer from userSlice
import feedReducer from './feedSlice'; // Import the feedSlice from feedSlice

const appStore = configureStore({
  reducer: { user: userReducer, feed: feedReducer }, // Add the user reducer to the store
});

export default appStore;
