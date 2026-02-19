import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const TokenPreserver = () => {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    // Store token in sessionStorage whenever profile loads
    if (profile?.token) {
      sessionStorage.setItem('_t', profile.token);
    }

    // If there's an ?access= token in the URL, move it to sessionStorage and clean the URL
    const urlToken = searchParams.get('access');
    if (urlToken) {
      sessionStorage.setItem('_t', urlToken);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('access');
      setSearchParams(newParams, { replace: true });
    }
  }, [location.pathname, profile]);

  return null;
};