import { useCallback, useState } from 'react';
import useAuthState from '../store/Auth/useAuthState';

const useRequest = () => {
  const authState = useAuthState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const request = useCallback(
    async <T>(url: string, options: RequestInit): Promise<T | null> => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: 'Bearer ' + authState.token,
          },
        });

        // 접근 권한 여부를 요청시마다 갱신이 필요함
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        return await response.json();
      } catch (e) {
        if (typeof e === 'string') setError(e);
        else if (e instanceof Error) setError(e.message);

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
