import { useTabBarVisibility } from "@/context/TabBarVisibilityContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";
import React, { useRef } from "react";
import { TextInput as RNTextInput, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import NavBarContent from "./NavBarContent";

interface TabHeaderBarProps {
    onMenuPress?: () => void;
}

export default function TabHeaderBar({ onMenuPress }: TabHeaderBarProps) {
    const { tabBarstyle } = useTabBarVisibility();
    const searchInputRef = useRef<RNTextInput | null>(null);
    const navigationState = useNavigationState((state) => state);
    const currentRoute = navigationState.routes[navigationState.index].name;

    const isDark = useColorScheme() === "dark";

    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
        article: "newspaper-outline",
        index: "home-outline",
        capsuleVideo: "videocam-outline",
    };

    const labelMap: Record<string, string> = {
        index: "Accueil",
        article: "Articles",
        capsuleVideo: "Vidéos",
    };

    return (
        <View>
            <NavBarContent isDark={isDark} searchInputRef={searchInputRef} onMenuPress={onMenuPress} />
        
            <View style={[
                tabBarstyle,
                {
                    flexDirection: "row",
                    justifyContent: "space-around",
                    paddingVertical: 10,
                    backgroundColor: isDark ? "#2C0F48" : "#FFE0FF",
                },
            ]}>
                {Object.keys(iconMap).map((key) => {
                    const isFocused = currentRoute === key;
                    return (
                        <TouchableOpacity
                            key={key}
                            style={{ alignItems: "center", justifyContent: "center", padding: 8 }}
                            onPress={() => {
                                const nav = require("expo-router").useRouter();
                                nav.push(key === "index" ? "/" : "/" + key);
                            }}
                        >
                            <Ionicons name={iconMap[key]} size={24} color={isFocused ? "#7C3AED" : "#A78BFA"}
                            />
                            <Text
                                style={{
                                    color: isFocused ? "#7C3AED" : "#A78BFA",
                                    fontSize: 10,
                                    fontWeight: "bold",
                                    marginTop: 4,
                                }}
                            >
                                {labelMap[key]}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}