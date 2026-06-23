// src/services/selectors/orderByNumberSelectors.ts
import { RootState } from '../store';

export const selectOrderByNumberState = (state: RootState) =>
  state.orderByNumber;
export const selectOrderByNumber = (state: RootState) =>
  state.orderByNumber.order;
export const selectOrderByNumberLoading = (state: RootState) =>
  state.orderByNumber.isLoading;
export const selectOrderByNumberError = (state: RootState) =>
  state.orderByNumber.error;
