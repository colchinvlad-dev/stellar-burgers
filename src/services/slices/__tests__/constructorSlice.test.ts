// src/services/slices/__tests__/constructorSlice.test.ts
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

// Мокаем uuid для предсказуемых тестов
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-12345')
}));

describe('Тестирование редьюсера constructorSlice', () => {
  // Определяем начальное состояние локально
  const initialState = {
    bun: null,
    ingredients: []
  };

  // Моковые данные для ингредиентов
  const mockBun: TIngredient = {
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
  };

  const mockIngredient1: TIngredient = {
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
  };

  const mockIngredient2: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
  };

  // Тест 1: Обработка неизвестного экшена с undefined в качестве начального состояния
  test('Должен вернуть начальное состояние при вызове с неизвестным экшеном', () => {
    const unknownAction = { type: 'UNKNOWN' };
    const result = constructorReducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  // Тест 2: addIngredient - добавление булки
  test('Должен правильно добавлять булку в конструктор', () => {
    const action = addIngredient(mockBun);
    const result = constructorReducer(initialState, action);

    expect(result.bun).toEqual({
      ...mockBun,
      id: 'test-uuid-12345'
    });
    expect(result.ingredients).toEqual([]);
  });

  // Тест 3: addIngredient - добавление обычного ингредиента
  test('Должен правильно добавлять обычный ингредиент в конструктор', () => {
    const stateWithBun = {
      bun: { ...mockBun, id: 'test-uuid-12345' },
      ingredients: []
    };

    const action = addIngredient(mockIngredient1);
    const result = constructorReducer(stateWithBun, action);

    expect(result.bun).toEqual(stateWithBun.bun);
    expect(result.ingredients).toEqual([
      { ...mockIngredient1, id: 'test-uuid-12345' }
    ]);
  });

  // Тест 4: addIngredient - добавление нескольких ингредиентов
  test('Должен правильно добавлять несколько ингредиентов в конструктор', () => {
    const stateWithBun = {
      bun: { ...mockBun, id: 'test-uuid-12345' },
      ingredients: [{ ...mockIngredient1, id: 'test-uuid-1' }]
    };

    // Добавляем второй ингредиент
    const action = addIngredient(mockIngredient2);
    const result = constructorReducer(stateWithBun, action);

    expect(result.ingredients).toHaveLength(2);
    expect(result.ingredients[0]).toEqual({
      ...mockIngredient1,
      id: 'test-uuid-1'
    });
    expect(result.ingredients[1]).toEqual({
      ...mockIngredient2,
      id: 'test-uuid-12345'
    });
  });

  // Тест 5: removeIngredient - удаление ингредиента
  test('Должен правильно удалять ингредиент из конструктора', () => {
    const state = {
      bun: { ...mockBun, id: 'test-uuid-12345' },
      ingredients: [
        { ...mockIngredient1, id: 'test-uuid-1' },
        { ...mockIngredient2, id: 'test-uuid-2' }
      ]
    };

    const action = removeIngredient('test-uuid-1');
    const result = constructorReducer(state, action);

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual({
      ...mockIngredient2,
      id: 'test-uuid-2'
    });
    expect(result.bun).toEqual(state.bun);
  });

  // Тест 6: moveIngredient - перемещение ингредиента вниз
  test('Должен правильно перемещать ингредиент вниз', () => {
    const state = {
      bun: { ...mockBun, id: 'test-uuid-12345' },
      ingredients: [
        { ...mockIngredient1, id: 'test-uuid-1' },
        { ...mockIngredient2, id: 'test-uuid-2' }
      ]
    };

    const action = moveIngredient({ from: 0, to: 1 });
    const result = constructorReducer(state, action);

    expect(result.ingredients[0]).toEqual({
      ...mockIngredient2,
      id: 'test-uuid-2'
    });
    expect(result.ingredients[1]).toEqual({
      ...mockIngredient1,
      id: 'test-uuid-1'
    });
  });

  // Тест 7: moveIngredient - перемещение ингредиента вверх
  test('Должен правильно перемещать ингредиент вверх', () => {
    const state = {
      bun: { ...mockBun, id: 'test-uuid-12345' },
      ingredients: [
        { ...mockIngredient1, id: 'test-uuid-1' },
        { ...mockIngredient2, id: 'test-uuid-2' }
      ]
    };

    const action = moveIngredient({ from: 1, to: 0 });
    const result = constructorReducer(state, action);

    expect(result.ingredients[0]).toEqual({
      ...mockIngredient2,
      id: 'test-uuid-2'
    });
    expect(result.ingredients[1]).toEqual({
      ...mockIngredient1,
      id: 'test-uuid-1'
    });
  });

  // Тест 8: moveIngredient - попытка перемещения за пределами массива
  test('Должен игнорировать перемещение за пределами массива', () => {
    const state = {
      bun: { ...mockBun, id: 'test-uuid-12345' },
      ingredients: [
        { ...mockIngredient1, id: 'test-uuid-1' },
        { ...mockIngredient2, id: 'test-uuid-2' }
      ]
    };

    // Попытка перемещения с невалидными индексами
    const actionInvalidFrom = moveIngredient({ from: -1, to: 0 });
    const resultInvalidFrom = constructorReducer(state, actionInvalidFrom);
    expect(resultInvalidFrom).toEqual(state);

    const actionInvalidTo = moveIngredient({ from: 0, to: 10 });
    const resultInvalidTo = constructorReducer(state, actionInvalidTo);
    expect(resultInvalidTo).toEqual(state);
  });

  // Тест 9: clearConstructor - очистка конструктора
  test('Должен очищать конструктор при вызове clearConstructor', () => {
    const state = {
      bun: { ...mockBun, id: 'test-uuid-12345' },
      ingredients: [
        { ...mockIngredient1, id: 'test-uuid-1' },
        { ...mockIngredient2, id: 'test-uuid-2' }
      ]
    };

    const action = clearConstructor();
    const result = constructorReducer(state, action);

    expect(result).toEqual(initialState);
    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });

  // Тест 10: addIngredient - замена булки
  test('Должен заменять булку при добавлении новой', () => {
    const state = {
      bun: { ...mockBun, id: 'old-uuid' },
      ingredients: []
    };

    const action = addIngredient({
      ...mockBun,
      _id: 'new-bun-id'
    });
    const result = constructorReducer(state, action);

    expect(result.bun?._id).toBe('new-bun-id');
    expect(result.bun?.id).toBe('test-uuid-12345');
  });

  // Тест 11: removeIngredient - удаление несуществующего ингредиента
  test('Должен игнорировать удаление несуществующего ингредиента', () => {
    const state = {
      bun: { ...mockBun, id: 'test-uuid-12345' },
      ingredients: [{ ...mockIngredient1, id: 'test-uuid-1' }]
    };

    const action = removeIngredient('non-existent-id');
    const result = constructorReducer(state, action);

    expect(result).toEqual(state);
    expect(result.ingredients).toHaveLength(1);
  });
});
