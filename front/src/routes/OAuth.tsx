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
  isFirst: boolean;
  otpIsActivated: boolean;
};

type loaderData = {
  oAuthData: oAuthResponseData | string;
};

const OAuth = () => {
  const dispatch = useDispatch();
  const { oAuthData } = useLoaderData() as loaderData;

  return (
    <Suspense fallback={<h1 style={{ textAlign: 'center' }}>...login...</h1>}>
      <Await resolve={oAuthData}>
        {(ret: oAuthResponseData | string) => {
          if (typeof ret === 'string') {
            return <h1 style={{ textAlign: 'center' }}>{ret}</h1>;
          } else if (ret.isFirst) {
            return (
              <Navigate
                to="/setting-profile"
                replace={true}
                state={{ jwtToken: ret.jwtToken }}
              />
            );
          } else if (ret.otpIsActivated) {
            return (
              <Navigate
                to="/otp"
                replace={true}
                state={{ jwtToken: ret.jwtToken }}
              />
            );
          } else {
            dispatch(authActions.setAuthToken(ret.jwtToken));
            return <Navigate to="/" replace={true} />;
          }
        }}
      </Await>
    </Suspense>
  );
};

const requestOAuth = async (
  request: Request
): Promise<oAuthResponseData | string> => {
  const url = new URL(request.url);
  const authCode = url.searchParams.get('code');

  try {
    const authResponse = await fetch(`http://localhost:3001/api/auth`, {
      method: 'POST',
      body: JSON.stringify({ code: authCode }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!authResponse.ok) {
      throw new Error('Login Failed');
    }

    const authData = await authResponse.json();

    // const otpResponse = await fetch(`http://localhost:3001/api/otp`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + authData.jwtToken,
    //   },
    // });

    // if (!otpResponse.ok) {
    //   throw new Error('OTP Failed');
    // }
    // const otpData = await otpResponse.json();

    return {
      ...authData,
      // otpIsActivated: otpData.isActive,
      otpIsActivated: false,
    };
  } catch (e) {
    if (typeof e === 'string') return e;
    else if (e instanceof Error) return e.message;
    else return 'Something Wrong';
  }
};

const loader = ({ request }: LoaderFunctionArgs) => {
  return defer({
    oAuthData: requestOAuth(request),
  });
};

export { loader };
export default OAuth;
