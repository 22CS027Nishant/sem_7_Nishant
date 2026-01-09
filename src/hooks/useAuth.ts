
import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<User>(
          'http://localhost:5000/api/auth/me',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUser(response.data);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await axios.post<AuthResponse>(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, logout };
};