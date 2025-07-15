import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  
  console.log('ProtectedRoute render - user:', user);

  if (!user) {
    console.log('No user found, rendering Login component');
    return <Login />;
  }

  console.log('User found, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;