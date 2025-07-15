import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, List, Package } from 'phosphor-react';

const BottomTabBar: React.FC = () => {
  const tabs = [
    {
      to: '/add',
      label: 'Add Item',
      icon: Plus,
      activeColor: 'text-accent'
    },
    {
      to: '/inventory',
      label: 'Inventory',
      icon: List,
      activeColor: 'text-accent'
    },
    {
      to: '/skus',
      label: 'Catalog',
      icon: Package,
      activeColor: 'text-accent'
    }
  ];

  return (
    <nav style={{
      position: 'fixed', 
      bottom: '20px', 
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      maxWidth: '374px',
      width: 'calc(100% - 40px)'
    }}>
      <div style={{
        backgroundColor: '#000000',
        borderRadius: '50px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        padding: '12px 8px'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 16px',
                minHeight: '44px',
                textDecoration: 'none',
                color: isActive ? '#8B5CF6' : 'white',
                fontWeight: isActive ? '600' : 'normal',
                transition: 'all 0.2s ease'
              })}
            >
              {({ isActive }) => (
                <>
                  <tab.icon 
                    size={22} 
                    weight={isActive ? 'fill' : 'regular'}
                    color={isActive ? '#8B5CF6' : 'white'}
                  />
                  <span style={{
                    fontSize: '11px', 
                    marginTop: '4px',
                    color: isActive ? '#8B5CF6' : 'white'
                  }}>{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomTabBar;