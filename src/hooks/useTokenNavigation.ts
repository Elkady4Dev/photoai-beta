import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useTokenNavigation = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const getCurrentToken = (): string | null => {
    // 1. sessionStorage (logged-in users, set by TokenPreserver)
    const sessionToken = sessionStorage.getItem('_t');
    if (sessionToken) return sessionToken;

    // 2. Fallback to profile (in case sessionStorage was cleared)
    if (profile?.token) return profile.token;

    // 3. URL fallback for dev/tester tokens that aren't in sessionStorage yet
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('access');
  };

  // Plain navigation — token is NOT added to URL
  const navigateWithToken = (path: string, options?: { replace?: boolean }) => {
    navigate(path, options);
  };

  return {
    navigateWithToken,
    getCurrentToken,
    userToken: profile?.token,
  };
};