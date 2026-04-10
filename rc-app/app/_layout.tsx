import { useColorScheme, AnalyticsService } from '@/src';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    AnalyticsService.init();

    // Flush les événements quand l'app passe en arrière-plan
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background' || state === 'inactive') {
        AnalyticsService.flush();
      }
    });

    return () => subscription.remove();
  }, []);

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...Ionicons.font,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false, gestureEnabled: true, gestureDirection: 'horizontal', animation: 'slide_from_right', presentation: 'card' }} />
        <Stack.Screen name="news/[id]" options={{ headerShown: false, gestureEnabled: true, gestureDirection: 'horizontal', animation: 'slide_from_right', presentation: 'card' }} />
        <Stack.Screen name="videos/[id]" options={{ headerShown: false, gestureEnabled: true, gestureDirection: 'horizontal', animation: 'slide_from_right', presentation: 'card' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
