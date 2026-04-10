import Rclogo from "@/assets/images/ui/rc_logo.svg";
import { Ionicons } from "@expo/vector-icons";
import React, { RefObject } from "react";
import { Image, TextInput as RNTextInput, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
    isDark: boolean;
    searchInputRef: RefObject<RNTextInput | null>;
    onMenuPress?: () => void;
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    logoContainer: {
        marginRight: 8,
    },
    searchContainer: {
        flex: 1,
        marginHorizontal: 8,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        paddingHorizontal: 12,
        height: 40,
    },
    icon: {
        width: 16,
        height: 16,
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
    },
    menuButton: {
        padding: 8,
        borderRadius: 20,
    },
});

export default function NavBarContent({ isDark, searchInputRef, onMenuPress }: Props) {
    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#F8F3" : "#C6D2" }]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
            <Rclogo width={42} height={42} />
        </View>

        {/* SearchBar */}
        <View style={styles.searchContainer}>
            <TouchableOpacity
            activeOpacity={1}
            onPress={() => searchInputRef.current?.focus()}
            style={[styles.searchBar, { backgroundColor: isDark ? "#2F2982" : "#FEF2F2" }]}
            >
            <Image source={require("@/assets/images/ui/loupe.png")} style={styles.icon} resizeMode="contain" />
            <TextInput
                ref={searchInputRef}
                placeholder="Rechercher..."
                placeholderTextColor={isDark ? "#ccc" : "#555"}
                style={[styles.input, { color: isDark ? "#fff" : "#000" }]}
            />
            </TouchableOpacity>
        </View>

        {/* Menu icon */}
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress} >
            <Ionicons name="menu" size={36} color={isDark ? "#FFF" : "#000"} />
        </TouchableOpacity>
        </View>
    );
}