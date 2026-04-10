import React, { createContext, useContext } from "react";

const TabBarContext = createContext<{
    handleScroll: any;
    tabBarstyle: any;
} | null>(null);

export const TabBarBVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
    // Simplified version without react-native-reanimated
    // No animations, just static values
    const handleScroll = () => {}; // Dummy scroll handler
    const tabBarstyle = {}; // No animated style

    return (
        <TabBarContext.Provider value={{ handleScroll, tabBarstyle }}>
            {children}
        </TabBarContext.Provider>
    );
};

export const useTabBarVisibility = () => {
    const context = useContext(TabBarContext);
    if(!context) {
        throw new Error("useTabBarVisibility must be used inside TabBarVisibilityProvider");
    }
    return context;
};