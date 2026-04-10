import { TabBarBVisibilityProvider } from '@/context/TabBarVisibilityContext';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
    return (
        <TabBarBVisibilityProvider>
            <Tabs
                tabBar={() => null} // plus de tab bar native
                screenOptions={{
                    header: () => null,
                }}
            >
                <Tabs.Screen name="article" />
                <Tabs.Screen name="index" />
                <Tabs.Screen name="capsuleVideo" />
            </Tabs>
        </TabBarBVisibilityProvider>
    );
}