// src/pages/profile/profile.tsx
import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectUser,
  selectIsUpdateLoading
} from '../../services/selectors/userSelectors';
import { updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isUpdating = useSelector(selectIsUpdateLoading);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Сохраняем исходные значения для сравнения
  const [initialValues, setInitialValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Флаг, что форма была изменена (для отображения кнопок)
  const [isFormChanged, setIsFormChanged] = useState(false);

  // Обновляем форму при изменении пользователя (после успешного сохранения)
  useEffect(() => {
    if (user) {
      const newValues = {
        name: user.name || '',
        email: user.email || '',
        password: ''
      };
      setFormValue(newValues);
      setInitialValues(newValues);
      setIsFormChanged(false);
    }
  }, [user]);

  // Проверяем, изменились ли данные в форме
  useEffect(() => {
    // Если идет обновление - не меняем флаг
    if (isUpdating) return;

    const changed =
      formValue.name !== initialValues.name ||
      formValue.email !== initialValues.email ||
      formValue.password !== initialValues.password;

    // Обновляем флаг только если он изменился
    if (isFormChanged !== changed) {
      setIsFormChanged(changed);
    }
  }, [formValue, initialValues, isUpdating, isFormChanged]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Формируем данные для отправки
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== initialValues.name) {
      updateData.name = formValue.name;
    }
    if (formValue.email !== initialValues.email) {
      updateData.email = formValue.email;
    }
    if (formValue.password !== initialValues.password && formValue.password) {
      updateData.password = formValue.password;
    }

    // Если есть что обновлять
    if (Object.keys(updateData).length > 0) {
      dispatch(updateUser(updateData))
        .unwrap()
        .then((updatedUser) => {
          // После успешного сохранения обновляем исходные значения
          const newInitialValues = {
            name: updatedUser.name || '',
            email: updatedUser.email || '',
            password: ''
          };
          setInitialValues(newInitialValues);
          setFormValue((prev) => ({
            ...prev,
            password: ''
          }));
          setIsFormChanged(false);
        })
        .catch(() => {
          // При ошибке кнопки остаются
        });
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // Возвращаем исходные значения
    setFormValue({
      name: initialValues.name,
      email: initialValues.email,
      password: ''
    });
    setIsFormChanged(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
