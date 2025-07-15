import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import AddItemPage from '../pages/AddItemPage';
import InventoryPage from '../pages/InventoryPage';
import SKUsPage from '../pages/SKUsPage';

const MainApp: React.FC = () => {
  console.log('MainApp component rendering');
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);
  
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<AddItemPage />} />
              <Route path="add" element={<AddItemPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="skus" element={<SKUsPage />} />
            </Route>
          </Routes>
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
};

export default MainApp;