import { RootState } from '../store';

export const selectOrderData = (state: RootState) => state.order.orderData;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;
