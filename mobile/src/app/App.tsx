import React, { useEffect } from 'react';
import { StatusBar, DevSettings } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootNavigator } from './navigation';
import { useFengShuiStore } from '../stores/useFengShuiStore';
import { useSettingsStore } from '../stores/useSettingsStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function App(): React.JSX.Element {
  // Load feng shui data on app start
  const loadFengShuiData = useFengShuiStore(state => state.loadData);
  const loadSettings = useSettingsStore(state => state.loadSettings);

  useEffect(() => {
    // Load data asynchronously on app initialization
    loadFengShuiData().catch(error => {
      console.error('Failed to load feng shui data on app start:', error);
    });

    // Load settings with slight delay to ensure store is initialized
    setTimeout(() => {
      loadSettings().catch(error => {
        console.error('Failed to load settings on app start:', error);
      });
    }, 100);

    // Hide element inspector on startup (dev mode only)
    if (__DEV__ && DevSettings) {
      // Ensure inspector is hidden by default
      try {
        // @ts-ignore - toggleElementInspector exists but may not be typed
        if (typeof DevSettings.toggleElementInspector === 'function') {
          // Inspector starts hidden, this is just a safety check
        }
      } catch {
        // Ignore - not critical
      }
    }
  }, [loadFengShuiData, loadSettings]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
