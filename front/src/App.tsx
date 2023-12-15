import { RouterProvider } from 'react-router-dom';
import router from './routes';
import ReduxProvider from './store/ReduxProvider';

function App() {
  return (
    <ReduxProvider>
      <RouterProvider router={router} />
    </ReduxProvider>
  );
}

export default App;
export const SERVER_URL = `http://${process.env.REACT_APP_HOST_DOMAIN}:${process.env.REACT_APP_HOST_PORT}`;
