// src/components/order-info/order-info.tsx
import { FC, useMemo, useEffect } from 'react';
import { OrderInfoUI } from '@ui';
import { Preloader } from '../ui/preloader';
import { useSelector, useDispatch } from '../../services/store';
import { selectFeedOrders } from '../../services/selectors/feedSelectors';
import { selectOrders } from '../../services/selectors/ordersSelectors';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';
import {
  selectOrderByNumber,
  selectOrderByNumberLoading
} from '../../services/selectors/orderByNumberSelectors';
import {
  getOrderByNumber,
  clearOrderByNumber
} from '../../services/slices/orderByNumberSlice';
import { useParams, useLocation } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectOrders);
  const ingredients = useSelector(selectIngredients);
  const orderByNumber = useSelector(selectOrderByNumber);
  const isLoading = useSelector(selectOrderByNumberLoading);

  const isProfileRoute = location.pathname.includes('/profile/orders');
  const orders = isProfileRoute ? profileOrders : feedOrders;

  // Ищем заказ в сторе
  let orderData = orders.find((item) => String(item.number) === number);

  // Если заказа нет в сторе, запрашиваем его
  useEffect(() => {
    if (!orderData && number) {
      dispatch(getOrderByNumber(Number(number)));
    }
    return () => {
      dispatch(clearOrderByNumber());
    };
  }, [dispatch, orderData, number]);

  // Если заказ еще не найден и идет загрузка
  if (isLoading || (!orderData && !orderByNumber)) {
    return <Preloader />;
  }

  // Используем данные из стора или из запроса по номеру
  const order = orderData || orderByNumber;

  if (!order) {
    return <Preloader />;
  }

  // Проверяем, что ингредиенты загружены
  if (!ingredients.length) {
    return <Preloader />;
  }

  // Формируем данные для отображения
  const orderInfo = {
    _id: order._id,
    status: order.status,
    name: order.name,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    number: order.number,
    ingredients: order.ingredients
  };

  // Подсчет общей стоимости
  const total = order.ingredients.reduce((sum, id) => {
    const ingredient = ingredients.find((item) => item._id === id);
    return sum + (ingredient?.price || 0);
  }, 0);

  // Формируем объект ingredientsInfo для OrderInfoUI
  const ingredientsInfo = order.ingredients.reduce(
    (acc, id) => {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        if (!acc[id]) {
          acc[id] = {
            ...ingredient,
            count: 0
          };
        }
        acc[id].count += 1;
      }
      return acc;
    },
    {} as { [key: string]: any }
  );

  // Форматирование даты
  const date = new Date(order.createdAt);

  return (
    <OrderInfoUI
      orderInfo={{
        ...orderInfo,
        ingredientsInfo: ingredientsInfo,
        date: date,
        total: total
      }}
    />
  );
};
