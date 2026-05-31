import React, {useState} from 'react';
import {Platform} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Route from './route';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import {store} from './redux/store';
import ErrorBoundary from './components/ErrorBoundary';
import PushNotificationBootstrap from './components/PushNotificationBootstrap';
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

  React.useEffect(() => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Orientation.lockToPortrait();
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <PushNotificationBootstrap />
          <Route />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
};

export default App;
