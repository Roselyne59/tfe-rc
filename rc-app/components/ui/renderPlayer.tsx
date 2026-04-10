import * as Linking from "expo-linking";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { WebView } from "react-native-webview";

export type VideoSource = "youtube" | "tiktok" | "facebook" | "instagram" | "other";

export const renderPlayer = (url: string, source: VideoSource) => {
    const [loading, setLoading] = useState(true);

    const handleLoadEnd = () => setLoading(false);

    if (source === "youtube") {
        const videoId = url.includes("v=") ? url.split("v=")[1] : url;
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
        <>
            {loading && <ActivityIndicator size="large" color="#F43098" style={{ marginTop: 20 }} />}
            <WebView
            source={{ uri: embedUrl }}
            style={{ height: 200, borderRadius: 8 }}
            onLoadEnd={handleLoadEnd}
            allowsFullscreenVideo
            />
        </>
        );
    }

    if (source === "tiktok" || source === "facebook" || source === "instagram") {
        return (
        <>
            {loading && <ActivityIndicator size="large" color="#F43098" style={{ marginTop: 20 }} />}
            <WebView
            source={{ uri: url }}
            style={{ height: 500, borderRadius: 8 }}
            onLoadEnd={handleLoadEnd}
            javaScriptEnabled
            allowsFullscreenVideo
            />
        </>
        );
    }

    // 🔹 Fallback si la source n’est pas supportée
    return (
        <Pressable onPress={() => Linking.openURL(url)}>
        <Text style={{ color: "#FFF", padding: 20, textAlign: "center", backgroundColor: "#000" }}>
            🎬 Ouvrir la vidéo
        </Text>
        </Pressable>
    );
};