// src/services/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface UserState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Добавляем отдельные поля для обновления
  updateUserRequest: boolean;
  updateUserError: string | null;
  // Добавляем для логина и регистрации
  loginUserRequest: boolean;
  loginUserError: string | null;
  registerUserRequest: boolean;
  registerUserError: string | null;
  logoutRequest: boolean;
  logoutError: string | null;
  // Для проверки авторизации
  isAuthChecked: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  updateUserRequest: false,
  updateUserError: null,
  loginUserRequest: false,
  loginUserError: null,
  registerUserRequest: false,
  registerUserError: null,
  logoutRequest: false,
  logoutError: null,
  isAuthChecked: false
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.updateUserRequest = false;
      state.updateUserError = null;
    },
    clearUserErrors: (state) => {
      state.error = null;
      state.loginUserError = null;
      state.registerUserError = null;
      state.updateUserError = null;
      state.logoutError = null;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginUserRequest = true;
        state.loginUserError = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.loginUserRequest = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Ошибка авторизации';
        state.error = action.error.message || 'Ошибка авторизации';
        state.isAuthChecked = true;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.registerUserRequest = true;
        state.registerUserError = null;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.registerUserRequest = false;
          state.user = action.payload;
          state.isAuthenticated = true;
          state.isAuthChecked = true;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.registerUserRequest = false;
        state.registerUserError = action.error.message || 'Ошибка регистрации';
        state.error = action.error.message || 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.updateUserRequest = true;
        state.updateUserError = null;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.updateUserRequest = false;
        state.user = action.payload;
        state.error = null;
        state.updateUserError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.updateUserRequest = false;
        state.updateUserError =
          action.error.message || 'Ошибка обновления данных';
        state.error = action.error.message || 'Ошибка обновления данных';
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.logoutRequest = true;
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutRequest = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutRequest = false;
        state.logoutError = action.error.message || 'Ошибка выхода';
      });
  }
});

export const { clearUser, clearUserErrors, setIsAuthChecked } =
  userSlice.actions;
export default userSlice.reducer;
