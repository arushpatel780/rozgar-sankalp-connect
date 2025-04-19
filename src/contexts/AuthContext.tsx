
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

type UserRole = 'seeker' | 'employer' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUserLocation: (location: string) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location?: string;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Mock API responses - In a real app, these would be API calls
const mockUsers = [
  {
    id: '1',
    name: 'Job Seeker',
    email: 'seeker@example.com',
    password: 'password123',
    role: 'seeker' as UserRole,
    location: '110001',
  },
  {
    id: '2',
    name: 'Employer',
    email: 'employer@example.com',
    password: 'password123',
    role: 'employer' as UserRole,
    location: '110001',
  },
  {
    id: '3',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin' as UserRole,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Failed to load user session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const matchedUser = mockUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (!matchedUser) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password",
        });
        return false;
      }
      
      // Create user object without password
      const { password: _, ...safeUser } = matchedUser;
      
      // Generate mock JWT
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      // Save to state and localStorage
      setUser(safeUser);
      setToken(mockToken);
      localStorage.setItem('user', JSON.stringify(safeUser));
      localStorage.setItem('token', mockToken);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${safeUser.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (mockUsers.some(u => u.email === userData.email)) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email is already registered",
        });
        return false;
      }
      
      // Create new user
      const newUser = {
        id: `${mockUsers.length + 1}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        location: userData.location || '',
      };
      
      // Generate mock JWT
      const mockToken = `mock-jwt-token-${Date.now()}`;
      
      // Save to state and localStorage
      setUser(newUser);
      setToken(mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', mockToken);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${newUser.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear user data from state and localStorage
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUserLocation = (location: string) => {
    if (user) {
      const updatedUser = { ...user, location };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Location updated",
        description: `Your location has been updated to ${location}.`,
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUserLocation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
