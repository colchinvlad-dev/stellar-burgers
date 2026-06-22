import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { selectConstructorItems } from '../../services/selectors/constructorSelectors';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const constructorItems = useSelector(selectConstructorItems);

  const ingredientsCounters = useMemo(() => {
    const bun = constructorItems?.bun || null;
    const constructorIngredients = constructorItems?.ingredients || [];

    const counters: { [key: string]: number } = {};

    // Считаем ингредиенты в конструкторе
    if (constructorIngredients && Array.isArray(constructorIngredients)) {
      constructorIngredients.forEach((ingredient: TIngredient) => {
        if (ingredient && ingredient._id) {
          counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
        }
      });
    }

    // Добавляем булку (счетчик 2)
    if (bun && bun._id) {
      counters[bun._id] = 2;
    }

    // Для всех ингредиентов устанавливаем счетчик 0, если его нет
    if (ingredients && Array.isArray(ingredients)) {
      ingredients.forEach((ingredient: TIngredient) => {
        if (ingredient && ingredient._id) {
          // Если счетчика нет - устанавливаем 0
          if (!counters.hasOwnProperty(ingredient._id)) {
            counters[ingredient._id] = 0;
          }
        }
      });
    }

    return counters;
  }, [constructorItems, ingredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
