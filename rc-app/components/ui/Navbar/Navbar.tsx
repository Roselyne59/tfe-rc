import Rclogo from "@/assets/images/ui/rc_logo.svg";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, TextInput, TouchableOpacity, View } from "react-native";

interface NavbarProps {
    isDark: boolean;
    searchInputRef: React.RefObject<TextInput | null>;
    onMenuPress: () => void;
}

export default function Navbar({ isDark, searchInputRef, onMenuPress }: NavbarProps) {
    return (
        <View className="h-16 rounded-3xl px-2 flex-row items-center"
            style={{ backgroundColor: isDark ? "#F8F3" : "#C6D2", }}
        >
            {/* Logo */}
            <Rclogo width={55} height={55} />

            {/* Searchbar */}
            <View className="flex-1 mx-4">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => searchInputRef.current?.focus()}
                    className="h-9 rounded-full px-4 flex-row items-center"
                    style={{
                    backgroundColor: isDark ? "#2F2982" : "#FEF2F2"
                    }}
                >
                <Image 
                    source={require("@/assets/images/ui/loupe.png")} 
                    className="w-4 h-4 mr-2"
                    resizeMode="contain"
                />
                <TextInput
                    ref={searchInputRef}
                    placeholder="Rechercher..."
                    placeholderTextColor={isDark ? "#ccc" : "#555"}
                    className="flex-1"
                    style={{ paddingVertical: 0, color: isDark ? "#fff" : "#000" }}
                />
                </TouchableOpacity>
            </View>
            
            {/* Menu icon */}
            <Pressable 
                onPress={onMenuPress}
                style={{
                    backgroundColor: isDark ? "#C6D2" : "#F4309820",
                    borderRadius: 20,
                    padding: 7,
                }}
            >
            <Ionicons name="menu" size={36} color="white" />
            </Pressable>
        </View>
    );
}