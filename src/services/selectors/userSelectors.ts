// src/services/selectors/userSelectors.ts
import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUpdateUserRequest = (state: RootState) =>
  state.user.updateUserRequest;
export const selectUpdateUserError = (state: RootState) =>
  state.user.updateUserError;
export const selectIsUpdateLoading = (state: RootState) =>
  state.user.updateUserRequest;
export const selectIsLoginLoading = (state: RootState) =>
  state.user.loginUserRequest;
export const selectIsRegisterLoading = (state: RootState) =>
  state.user.registerUserRequest;
export const selectIsLogoutLoading = (state: RootState) =>
  state.user.logoutRequest;
