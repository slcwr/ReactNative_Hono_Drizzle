import React from 'react';
import { AppProviders } from './app/providers';
import { AppNavigator } from './app/navigation';

const App: React.FC = () => {
  return (
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  );
};

export default App;
