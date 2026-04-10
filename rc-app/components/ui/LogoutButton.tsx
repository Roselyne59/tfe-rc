import { useAuthStore } from "@/src";
import React from "react";
import { Pressable, Text, useColorScheme } from "react-native";

export default function LogoutButton() {
    const { user, logout } = useAuthStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    if (!user) return null; //Bouton cacher lorsque l'utilisateur n'est pas connecté

    return (
        <Pressable 
            onPress={() => {logout(); }}
            style={{
                backgroundColor: isDark ? "#E0E7FF" : "#FCF2FD",
                borderRadius: 99,
                padding: 10,
                margin: 15,
            }}
        >
            <Text style={{ color: "#000", textAlign: "center", fontWeight: "bold", fontSize: 16, }}>
                Se déconnecter
            </Text>
        </Pressable>
    );
}