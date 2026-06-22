import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

export const selectConstructorItems = (state: RootState) => {
  if (!state.constructor) {
    return { bun: null, ingredients: [] };
  }
  return {
    bun: state.constructor.bun || null,
    ingredients: state.constructor.ingredients || []
  };
};

export const selectConstructorBun = (state: RootState) =>
  state.constructor?.bun || null;

export const selectConstructorIngredients = (state: RootState) =>
  state.constructor?.ingredients || [];

export const selectConstructorTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }
);

export const selectIngredientCount = (ingredientId: string) =>
  createSelector(
    [selectConstructorBun, selectConstructorIngredients],
    (bun, ingredients) => {
      let count = ingredients.filter(
        (item) => item._id === ingredientId
      ).length;
      if (bun && bun._id === ingredientId) {
        count += 2;
      }
      return count;
    }
  );
