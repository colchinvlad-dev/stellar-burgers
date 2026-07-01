// src/services/slices/__tests__/ingredientsSlice.test.ts
import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Тестирование редьюсера ingredientsSlice', () => {
  // Определяем начальное состояние локально
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  // Моковые данные для тестов
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
    }
  ];

  // Тест 1: Обработка неизвестного экшена с undefined в качестве начального состояния
  test('Должен вернуть начальное состояние при вызове с неизвестным экшеном', () => {
    const unknownAction = { type: 'UNKNOWN' };
    const result = ingredientsReducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  // Тест 2: Обработка асинхронного экшена fetchIngredients.pending
  test('Должен установить isLoading в true при вызове fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(initialState, action);
    expect(result).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  // Тест 3: Обработка асинхронного экшена fetchIngredients.fulfilled
  test('Должен заполнить ингредиенты и сбросить isLoading при вызове fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const result = ingredientsReducer(initialState, action);
    expect(result).toEqual({
      ...initialState,
      isLoading: false,
      ingredients: mockIngredients
    });
  });

  // Тест 4: Обработка асинхронного экшена fetchIngredients.rejected
  test('Должен установить error при вызове fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const result = ingredientsReducer(initialState, action);
    expect(result).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });

  // Тест 5: Проверка последовательности состояний (pending -> fulfilled)
  test('Должен корректно обрабатывать последовательность pending и fulfilled', () => {
    // Начальное состояние
    let state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(state.isLoading).toBe(true);

    // Fulfilled
    state = ingredientsReducer(state, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  // Тест 6: Проверка последовательности состояний (pending -> rejected)
  test('Должен корректно обрабатывать последовательность pending и rejected', () => {
    const errorMessage = 'Network Error';

    // Начальное состояние
    let state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(state.isLoading).toBe(true);

    // Rejected
    state = ingredientsReducer(state, {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    });
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([]);
    expect(state.error).toBe(errorMessage);
  });
});
