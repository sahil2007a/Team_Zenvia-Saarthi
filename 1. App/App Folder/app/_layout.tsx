import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../i18n'; // Initialize i18n
import { Colors } from '../constants/colors';
import { useUserStore } from '../store/userStore';
import { useOfflineStore } from '../store/offlineStore';
import { useItineraryStore } from '../store/itineraryStore';
import { DemoBanner } from '../components/common/DemoBanner';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { AudioPlayerBar } from '../components/audio/AudioPlayerBar';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const hydrateUser = useUserStore((s) => s.hydrate);
  const hydrateOffline = useOfflineStore((s) => s.hydrate);
  const hydrateItinerary = useItineraryStore((s) => s.hydrate);
  const isOnboardingComplete = useUserStore((s) => s.isOnboardingComplete);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    async function initialize() {
      try {
        await Promise.all([hydrateUser(), hydrateOffline(), hydrateItinerary()]);
      } catch (err) {
        console.warn('Hydration error:', err);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    initialize();
  }, []);

  // Onboarding redirection check
  useEffect(() => {
    const inOnboarding = segments[0] === 'onboarding';
    if (!isOnboardingComplete && !inOnboarding) {
      router.replace('/onboarding');
    }
  }, [isOnboardingComplete, segments]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'ios' ? ['top'] : []}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={Colors.surface}
          />
          <DemoBanner />
          <OfflineBanner />

          <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="onboarding"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="site/[id]"
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="story/[id]"
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="itinerary/[id]"
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="place/[id]"
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="intro"
              options={{
                headerShown: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="site/[id]/experience"
              options={{
                headerShown: false,
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="experience/[id]"
              options={{
                headerShown: false,
                animation: 'fade',
              }}
            />
          </Stack>
        </View>

        {/* Global floating Audio Player Bar */}
        <AudioPlayerBar />
        </SafeAreaView>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
