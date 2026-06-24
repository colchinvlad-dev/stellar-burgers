import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/selectors/userSelectors';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: ReactNode;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
