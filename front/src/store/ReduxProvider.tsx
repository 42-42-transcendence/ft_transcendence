import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '.';
import { Provider } from 'react-redux';

type Props = {
  children: React.ReactNode;
};

const ReduxProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
