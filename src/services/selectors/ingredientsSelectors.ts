import { RootState } from '../store';

export const selectIngredients = (state: RootState) =>
  state.ingredients?.ingredients || [];

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients?.isLoading || false;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients?.error || null;
