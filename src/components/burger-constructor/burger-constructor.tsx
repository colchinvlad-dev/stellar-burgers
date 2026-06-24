// src/components/burger-constructor/burger-constructor.tsx
import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectConstructorItems,
  selectConstructorTotalPrice
} from '../../services/selectors/constructorSelectors';
import {
  selectOrderLoading,
  selectOrderData
} from '../../services/selectors/orderSelectors';
import {
  selectOrderByNumber,
  selectOrderByNumberLoading
} from '../../services/selectors/orderByNumberSelectors';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';
import { selectIsAuthenticated } from '../../services/selectors/userSelectors';
import { createOrder, closeOrderModal } from '../../services/slices/orderSlice';
import {
  getOrderByNumber,
  clearOrderByNumber
} from '../../services/slices/orderByNumberSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectConstructorItems);
  const totalPrice = useSelector(selectConstructorTotalPrice);
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrderData);
  const orderByNumberData = useSelector(selectOrderByNumber);
  const orderByNumberLoading = useSelector(selectOrderByNumberLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const ingredients = useSelector(selectIngredients);

  const onOrderClick = () => {
    if (!constructorItems.bun) {
      return;
    }

    if (orderRequest || orderByNumberLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then((orderData) => {
        dispatch(clearConstructor());
        if (orderData && orderData.number) {
          dispatch(getOrderByNumber(orderData.number));
        }
      })
      .catch((error) => {
        console.error('Ошибка создания заказа:', error);
      });
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
    dispatch(clearOrderByNumber());
  };

  // Функция для построения полной информации о заказе
  const buildOrderDataForModal = () => {
    // Если есть полные данные из orderByNumber - используем их
    if (orderByNumberData) {
      return {
        _id: orderByNumberData._id,
        status: orderByNumberData.status,
        name: orderByNumberData.name,
        createdAt: orderByNumberData.createdAt,
        updatedAt: orderByNumberData.updatedAt,
        number: orderByNumberData.number,
        ingredients: orderByNumberData.ingredients || []
      };
    }

    // Если есть данные из order (только номер и имя) - используем их
    if (orderModalData) {
      // Для состава заказа используем ингредиенты из конструктора
      const orderIngredients = [
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun?._id
      ].filter(Boolean) as string[];

      return {
        _id: String(orderModalData.number),
        status: 'done',
        name: orderModalData.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: orderModalData.number,
        ingredients: orderIngredients
      };
    }

    return null;
  };

  const orderDataForModal = buildOrderDataForModal();

  const safeConstructorItems = {
    bun: constructorItems?.bun || null,
    ingredients: constructorItems?.ingredients || []
  };

  const isLoading = orderRequest || orderByNumberLoading;

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={isLoading}
      constructorItems={safeConstructorItems}
      orderModalData={orderDataForModal}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
