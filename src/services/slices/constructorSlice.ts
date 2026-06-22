import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        // Убеждаемся, что ingredients существует
        const currentIngredients = state.ingredients || [];

        if (action.payload.type === 'bun') {
          return {
            ...state,
            bun: action.payload,
            ingredients: currentIngredients
          };
        } else {
          return {
            ...state,
            ingredients: [...currentIngredients, action.payload]
          };
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const currentIngredients = state.ingredients || [];
      return {
        ...state,
        ingredients: currentIngredients.filter(
          (item) => item.id !== action.payload
        )
      };
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const currentIngredients = [...(state.ingredients || [])];

      if (
        from >= 0 &&
        from < currentIngredients.length &&
        to >= 0 &&
        to < currentIngredients.length
      ) {
        const [removed] = currentIngredients.splice(from, 1);
        currentIngredients.splice(to, 0, removed);
      }

      return {
        ...state,
        ingredients: currentIngredients
      };
    },
    clearConstructor: (state) => ({
      ...state,
      bun: null,
      ingredients: []
    })
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
