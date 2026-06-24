import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count = 0 }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient) {
        dispatch(addIngredient(ingredient));
      }
    };

    // Убеждаемся что count всегда число и передаем даже если 0
    const displayCount = count !== undefined && count !== null ? count : 0;

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={displayCount}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
