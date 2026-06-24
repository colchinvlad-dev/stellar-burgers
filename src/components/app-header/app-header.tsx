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

  // Базовый стиль для ссылок
  const baseLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
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
        {/* Левая часть - Конструктор и Лента заказов */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <NavLink
            to='/'
            style={({ isActive }) => ({
              ...baseLinkStyle,
              color: isActive ? '#F2F2F3' : '#8585AD'
            })}
            className='header-link'
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2 mr-10'>
                  Конструктор
                </p>
              </>
            )}
          </NavLink>

          <NavLink
            to='/feed'
            style={({ isActive }) => ({
              ...baseLinkStyle,
              color: isActive ? '#F2F2F3' : '#8585AD'
            })}
            className='header-link'
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2'>
                  Лента заказов
                </p>
              </>
            )}
          </NavLink>
        </div>

        {/* Центральная часть - Логотип */}
        <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>

        {/* Правая часть - Личный кабинет */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
          <NavLink
            to='/profile'
            style={({ isActive }) => ({
              ...baseLinkStyle,
              color: isActive ? '#F2F2F3' : '#8585AD'
            })}
            className='header-link'
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2'>
                  {user?.name || 'Личный кабинет'}
                </p>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
