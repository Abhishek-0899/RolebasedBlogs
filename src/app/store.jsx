import { configureStore } from "@reduxjs/toolkit";
import postReducers from "../features/posts/postSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

/* Combine reducers */
const rootReducer = combineReducers({
  posts: postReducers,
});

/* Persist config */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["posts"], // only persist posts slice
};

/* Create persisted reducer */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* Create store */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

/* Create persistor */
export const persistor = persistStore(store);