import { Video, useFavoritesStore } from "@/src";
import { Link } from "expo-router";
import React from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";

type Props = {
    video: Video;
    onPress?: () => void;
};

export default function VideosCard({ video, onPress }: Props) {
    const favorited = useFavoritesStore((s) =>
        s.favorites.some((f) => f.id === video?.id && f.type === "videos")
    );

    const openVideo = () => {
        const link = video.videoUrl;
        if (link) Linking.openURL(link);
    };

    const formattedDate = new Date(video.uploadedAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Link href={`/videos/${video.id}`} asChild>
            <TouchableOpacity className="bg-white rounded p-4 mb-3" onPress={onPress}>
                <Image
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                />
                <View className="flex-row justify-between items-start mt-2">
                    <Text className="font-bold text-lg flex-1">{video.title}</Text>
                    {favorited && <HeartIconSolid size={18} color="#F43098" />}
                </View>
                <Text className="text-sm text-gray-500">{video.description}</Text>
                <Text className="text-gray-400 text-xs">{formattedDate}</Text>
            </TouchableOpacity>
        </Link>
    );
}
