import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SignOut } from 'phosphor-react';
import BottomTabBar from './BottomTabBar';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      maxWidth: '414px',
      margin: '0 auto',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h1 style={{
          fontWeight: 'bold',
          color: '#1f2937',
          fontSize: '20px',
          margin: 0
        }}>
          Camorent Inventory
        </h1>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6b7280',
            backgroundColor: 'transparent',
            border: 'none',
            padding: '8px',
            minHeight: '44px',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          title="Logout"
          onMouseOver={(e) => (e.target as HTMLElement).style.backgroundColor = '#f3f4f6'}
          onMouseOut={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
        >
          <SignOut size={20} />
          <span style={{fontSize: '14px'}}>Logout</span>
        </button>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1, 
        padding: '20px', 
        backgroundColor: '#fef7ed', 
        minHeight: '500px',
        paddingBottom: '120px',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
};

export default Layout;