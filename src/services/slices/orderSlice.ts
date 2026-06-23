// src/services/slices/orderSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

// Создаем тип для данных заказа в модалке
export type TOrderModalData = {
  number: number;
  name: string;
  ingredients?: string[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
};

interface OrderState {
  orderData: TOrderModalData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderData: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<TOrderModalData, string[]>(
  'order/createOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    // data.order имеет тип TNewOrder, у которого есть только number и _id
    // Возвращаем только то, что есть
    return {
      number: data.order.number,
      name: data.name,
      // Остальные поля опциональны, так как могут отсутствовать в ответе
      _id: data.order._id
    };
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
      state.error = null;
    },
    closeOrderModal: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrderModalData>) => {
          state.isLoading = false;
          state.orderData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  }
});

export const { clearOrder, closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
