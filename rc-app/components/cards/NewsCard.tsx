import { Article, useFavoritesStore } from "@/src";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";

type Props = {
    article: Article;
    onPress?: () => void;
};

export default function NewsCard({ article, onPress }: Props) {
    const favorited = useFavoritesStore((s) =>
        s.favorites.some((f) => f.id === article?.id && f.type === "news")
    );

    // Protection contre les valeurs undefined
    if (!article) {
        return (
            <TouchableOpacity className="bg-gray-200 rounded p-4 mb-3">
                <Text className="text-gray-500 text-lg">Article indisponible</Text>
            </TouchableOpacity>
        );
    }

    const formattedDate = article.createdAt
        ? new Date(article.createdAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Date non disponible";

    return (
        <Link href={`/news/${article.id}`} asChild>
            <TouchableOpacity className="bg-white rounded p-4 mb-3" onPress={onPress}>
                <View className="flex-row justify-between items-start">
                    <Text className="text-black text-lg font-bold flex-1">{article.title || "Titre indisponible"}</Text>
                    {favorited && <HeartIconSolid size={18} color="#F43098" />}
                </View>
                <Text className="text-gray-600 text-xs mt-1">{formattedDate}</Text>
                <Text className="text-black mt-2" numberOfLines={3}>
                    {article.content || article.description || "Contenu indisponible"}
                </Text>
            </TouchableOpacity>
        </Link>
    );
}
