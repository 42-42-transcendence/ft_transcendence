import { useDispatch } from 'react-redux';
import {
  LoaderFunctionArgs,
  useLoaderData,
  Navigate,
  defer,
  Await,
} from 'react-router-dom';
import { actions as authActions } from '../store/Auth/auth';
import { Suspense } from 'react';

type oAuthResponseData = {
  jwtToken: string;
  userName: string;
};

type loaderData = {
  oAuthData: oAuthResponseData | string;
};

const OAuth = () => {
  const dispatch = useDispatch();
  const data = useLoaderData() as loaderData;

  return (
    <Suspense fallback={<h1 style={{ textAlign: 'center' }}>...login...</h1>}>
      <Await resolve={data.oAuthData}>
        {(ret: oAuthResponseData | string) => {
          if (typeof ret === 'string') {
            return <h1 style={{ textAlign: 'center' }}>{ret}</h1>;
          } else {
            dispatch(authActions.setAuthToken(ret.jwtToken));
            dispatch(authActions.setUserID(ret.userName));
            return (
              <Navigate
                // to={ret.isSignUp ? '/' : '/setting-profile'}
                to="/"
                replace={true}
              />
            );
          }
        }}
      </Await>
    </Suspense>
  );
};

const requestOAuth = async (request: Request) => {
  const url = new URL(request.url);
  const authCode = url.searchParams.get('code');

  try {
    const res = await fetch(`SERVER_URL/api/auth`, {
      method: 'POST',
      body: JSON.stringify({ code: authCode }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Login Faile');
    }

    const data = await res.json();
    return data;
  } catch (e) {
    if (typeof e === 'string') return e;
    if (e instanceof Error) return e.message;
    return 'Something Wrong';
  }
};

const loader = ({ request }: LoaderFunctionArgs) => {
  return defer({
    oAuthData: requestOAuth(request),
  });
};

export { loader };
export default OAuth;
