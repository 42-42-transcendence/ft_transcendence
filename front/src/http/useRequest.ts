import { useCallback, useState } from 'react';
import useAuthState from '../store/Auth/useAuthState';

const useRequest = <T>() => {
  const authState = useAuthState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const request = useCallback(
    async (url: string, options: RequestInit): Promise<T | null> => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: 'Bearer ' + authState.token,
          },
          ...options,
        });

        // yet: 접근 권한 여부를 요청시마다 갱신이 필요함
        if (!response.ok) {
          throw new Error('Request Failed - ' + response.status);
        }

        return await response.json();
      } catch (e) {
        if (typeof e === 'string') setError('Error: ' + e);
        else if (e instanceof Error) setError('Error: ' + e.message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [authState]
  );

  return { isLoading, error, request };
};
export default useRequest;
