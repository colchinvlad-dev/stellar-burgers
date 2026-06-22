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
import { selectIsAuthenticated } from '../../services/selectors/userSelectors';
import { createOrder, closeOrderModal } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectConstructorItems);
  const totalPrice = useSelector(selectConstructorTotalPrice);
  const orderRequest = useSelector(selectOrderLoading);
  const orderModalData = useSelector(selectOrderData);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const onOrderClick = () => {
    // Проверяем, есть ли булка
    if (!constructorItems.bun) {
      return;
    }

    // Проверяем, не идет ли уже запрос
    if (orderRequest) {
      return;
    }

    // Если пользователь не авторизован - перенаправляем на логин
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    // Формируем массив ID ингредиентов для заказа
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch((error) => {
        console.error('Ошибка создания заказа:', error);
      });
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
  };

  const orderData = orderModalData
    ? {
        _id: String(orderModalData.number),
        status: 'done',
        name: orderModalData.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: orderModalData.number,
        ingredients: []
      }
    : null;

  const safeConstructorItems = {
    bun: constructorItems?.bun || null,
    ingredients: constructorItems?.ingredients || []
  };

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={safeConstructorItems}
      orderModalData={orderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
