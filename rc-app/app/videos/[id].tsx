import { VideosAPI, Video, useColorScheme, useTrackArticle, AnalyticsService, useFavoritesStore } from "@/src";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Share, Text, View } from "react-native";
import { ArrowLeftIcon, ShareIcon, HeartIcon } from "react-native-heroicons/outline";
import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";


export default function VideoDetails() {
    const { id } = useLocalSearchParams();
    const videoId = Number(id);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
    const isFavorited = useFavoritesStore((s) =>
        s.favorites.some((f) => f.id === videoId && f.type === "videos")
    );

    useTrackArticle(video?.id ?? null, "video");

    const handleShare = async () => {
        if (!video) return;
        try {
            await Share.share({
                title: video.title,
                message: `${video.title}\n\nVu sur Revue Citoyenne`,
            });
            AnalyticsService.trackEvent("article_share", video.id);
        } catch {}
    };

    const handleFavorite = () => {
        if (!video) return;
        toggleFavorite(video.id, "videos");
        AnalyticsService.trackEvent("article_favorite", video.id, {
            metadata: { favorited: !isFavorited },
        });
    };

    const bgColor = isDark ? "#3A1266" : "#F4309820";
    const cardColor = isDark ? "#A1ACD9" : "#F4309820";
    const infoCardColor = isDark ? "#C5CAE9" : "#E7E9F0";
    const titleColor = isDark ? "#FFF" : "#111";
    const textColor = "#111";
    const secondaryText = "#555";

    useEffect(() => {
        const fetchVideo = async () => {
        try {
            const data = await VideosAPI.getById(videoId);
            setVideo(data);
        } catch (err) {
            console.error("❌ Erreur chargement vidéo", err);
        } finally {
            setLoading(false);
        }
        };
        fetchVideo();
    }, [videoId]);

    if (loading) return <ActivityIndicator size="large" color="#F43098" style={{ marginTop: 50 }} />;
    if (!video) return <Text className="text-center text-red-500 mt-10">Vidéo introuvable</Text>;


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 60 }} style={{ flex: 1, backgroundColor: bgColor}}>
                <View className="flex-row justify-between items-center mb-5">
                    <Pressable onPress={() => router.back()} className="w-10">
                        <ArrowLeftIcon size={23} color={isDark ? "#FFF" : "#000"}/>
                    </Pressable>
                    <View className="flex-row gap-4">
                        <Pressable onPress={handleShare}>
                            <ShareIcon size={23} color={isDark ? "#FFF" : "#000"}/>
                        </Pressable>
                        <Pressable onPress={handleFavorite}>
                            {isFavorited
                                ? <HeartIconSolid size={23} color="#F43098"/>
                                : <HeartIcon size={23} color={isDark ? "#FFF" : "#000"}/>
                            }
                        </Pressable>
                    </View>
                </View>

                <Text style={{ color: titleColor }} className="text-center text-2xl font-extrabold mb-5">
                    {video.title}
                </Text>

                {/* Card 1: Lecteur vidéo */}
                <View className="rounded-lg shadow-md mb-6 p-2" style={{ backgroundColor: cardColor }}>
                    <Text style={{ color: textColor }} className="text-base mb-2">
                        Lien vidéo : {video.videoUrl || "URL non disponible"}
                    </Text>
                    {/* TODO: Intégrer un vrai lecteur vidéo ici */}
                </View>

                {/* Card 2: Informations détaillées */}
                <View style={{ backgroundColor: infoCardColor }} className="p-5 rounded-xl shadow-md mb-6">
                    <Text style={{ color: textColor }} className="text-lg font-bold mb-1">Description :</Text>
                    <Text style={{ color: secondaryText }} className="text-base mb-4">
                        {video.description || "Aucune description"}
                    </Text>

                    <Text style={{ color: textColor }} className="text-lg font-bold mb-1">Date de publication :</Text>
                    <Text  style={{ color: secondaryText }} className="text-sm mb-1">{video.uploadedAt ? new Date(video.uploadedAt).toLocaleDateString() : "Non définie"}</Text>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}