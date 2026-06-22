// src/components/app-header/app-header.tsx
import React, { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();

  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname === '/feed';
  const isProfileActive = location.pathname.startsWith('/profile');

  // Используем inline стили для ссылок
  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer'
  };

  return (
    <header
      style={{
        backgroundColor: '#1C1C21',
        padding: '16px 0',
        boxShadow:
          '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)'
      }}
    >
      <nav
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <NavLink to='/' style={linkStyle}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink to='/feed' style={linkStyle}>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
          <NavLink to='/'>
            <Logo className='' /> {/* Добавляем пустой className */}
          </NavLink>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
          <NavLink to='/profile' style={linkStyle}>
            <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>
              {user?.name || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
