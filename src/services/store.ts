// src/services/store.ts
import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userReducer from './slices/userSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';
import orderByNumberReducer from './slices/orderByNumberSlice';
import orderReducer from './slices/orderSlice';

export const rootReducer = {
  user: userReducer,
  ingredients: ingredientsReducer,
  constructor: constructorReducer,
  feed: feedReducer,
  orders: ordersReducer,
  orderByNumber: orderByNumberReducer,
  order: orderReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
