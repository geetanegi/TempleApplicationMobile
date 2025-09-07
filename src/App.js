import React, {useState} from 'react';
import Route from './route';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import {store} from './redux/store';
import ErrorBoundary from './components/ErrorBoundary';
import {addTrack, setupPlayer} from '../musicPlayerService';

let persistor = persistStore(store);

const App = () => {
  const [isPlayerReady, setIsPlayerReady] = useState();
  async function setup() {
    let isSetup = await setupPlayer();
    if (isSetup) {
      await addTrack();
    }
    setIsPlayerReady(isSetup);
  }
  React.useEffect(() => {
    setup();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <Route />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
};

export default App;
