import AnimatedTabBarWrapped from '@/components/ui/TabBar/AnimatedTabBarWrapped.ios';
import { TabBarBVisibilityProvider } from '@/context/TabBarVisibilityContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View, useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const tabBarBackgroundColor = isDark ? '#2C0F48' : '#FFE0FF';
  const focusedButtonColor = isDark ? '#7C3AED' : '#F75BAF';
  const unfocusedButtonColor = isDark ? '#A78BFA' : '#FCAFD9';

  return (
    <TabBarBVisibilityProvider>
      <Tabs
        tabBar={(props) => <AnimatedTabBarWrapped {...props} />}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle:{
            height: 90,
            backgroundColor: tabBarBackgroundColor,
            borderTopWidth: 0,
            position: 'absolute',
            paddingBottom: 15,
            paddingTop: 15,
          },
          tabBarItemStyle: {
            justifyContent: 'center',
          },
          tabBarIcon: ({ focused }) => {
            const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
              index: 'home-outline',
              news: 'newspaper-outline',
              videos: 'videocam-outline',
            };
            const labels: Record<string, string> = {
              index: 'Accueil',
              news: 'News',
              videos: 'Vidéos',
            };

            const iconName = iconMap[route.name];
            const label = labels[route.name];

            return (
              <View style={{ 
                alignItems: 'center', 
                justifyContent: 'center', 
                paddingHorizontal: 5, 
                paddingVertical: 10, 
                borderRadius: 999, 
                backgroundColor: focused ? focusedButtonColor : unfocusedButtonColor, 
                minWidth: 75,
                height: 45,
              }}>
                {focused ? (
                  <Ionicons name={iconName!} size={25} color="white" /> 
                ) : (
                  <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', }}>
                    {labels[route.name] ?? route.name}
                  </Text>  
                )}
              </View>
            );
          },
        })}
      >
        <Tabs.Screen name="news" />
        <Tabs.Screen name="index" />
        <Tabs.Screen name="videos" />
      </Tabs>
    </TabBarBVisibilityProvider>
  );
}
