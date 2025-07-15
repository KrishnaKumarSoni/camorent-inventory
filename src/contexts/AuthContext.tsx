import React, { createContext, useContext, useEffect, useState } from 'react';

interface SimpleUser {
  id: string;
  email: string;
  name: string;
  uid?: string; // For backwards compatibility
}

interface AuthContextType {
  user: SimpleUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation - accept any email/password for demo
    if (email && password) {
      const userWithUid = { 
        id: 'demo-user', 
        email: email, 
        name: email.split('@')[0], 
        uid: 'demo-user' 
      };
      setUser(userWithUid);
      localStorage.setItem('user', JSON.stringify(userWithUid));
    } else {
      throw new Error('Please enter valid credentials');
    }
  };

  const register = async (email: string, password: string) => {
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation - accept any email/password for demo
    if (email && password) {
      const userWithUid = { 
        id: 'demo-user', 
        email: email, 
        name: email.split('@')[0], 
        uid: 'demo-user' 
      };
      setUser(userWithUid);
      localStorage.setItem('user', JSON.stringify(userWithUid));
    } else {
      throw new Error('Please enter valid credentials');
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check for existing user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);
  
  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout
  };

  console.log('AuthProvider render - loading:', loading, 'user:', user);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};