import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/hooks/useAuth';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  // Handle the error if splash screen is already hidden
});

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#E91E63',
      padding: 20
    }}>
      <Text style={{ 
        color: 'white', 
        fontSize: 24, 
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
      }}>
        Something went wrong
      </Text>
      <Text style={{ 
        color: 'white', 
        fontSize: 14, 
        marginBottom: 20,
        textAlign: 'center',
        opacity: 0.8
      }}>
        {error?.message || 'An unexpected error occurred'}
      </Text>
      <Text 
        style={{ 
          color: 'white', 
          fontSize: 16,
          textDecorationLine: 'underline'
        }}
        onPress={resetErrorBoundary}
      >
        Try again
      </Text>
    </View>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (fontsLoaded || fontError) {
          // Add a small delay to ensure everything is ready
          await new Promise(resolve => setTimeout(resolve, 100));
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn('Error during app preparation:', e);
        setAppIsReady(true); // Continue anyway
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen after the app is ready
      SplashScreen.hideAsync().catch(() => {
        // Handle the error if splash screen is already hidden
      });
    }
  }, [appIsReady]);

  // Show loading screen while preparing
  if (!appIsReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#E91E63' 
      }}>
        <Text style={{ 
          color: 'white', 
          fontSize: 32, 
          fontWeight: 'bold',
          letterSpacing: 2,
          marginBottom: 20
        }}>
          Myntra
        </Text>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ 
          color: 'white', 
          fontSize: 14, 
          marginTop: 16,
          opacity: 0.8
        }}>
          Loading your shopping experience...
        </Text>
      </View>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="categories/[category]" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </ErrorBoundary>
  );
}