import { FC, useMemo } from 'react';
import { OrderInfoUI } from '@ui';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import { selectFeedOrders } from '../../services/selectors/feedSelectors';
import { selectOrders } from '../../services/selectors/ordersSelectors';
import { selectIngredients } from '../../services/selectors/ingredientsSelectors';
import { useParams, useLocation } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectOrders);
  const ingredients = useSelector(selectIngredients);

  const isProfileRoute = location.pathname.includes('/profile/orders');
  const orders = isProfileRoute ? profileOrders : feedOrders;

  const order = orders.find((item) => String(item.number) === number);

  if (!order) {
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
    ingredients: order.ingredients // оставляем как массив строк
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
