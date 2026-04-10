import { ArticlesAPI, Article, useColorScheme, useTrackArticle, AnalyticsService, useFavoritesStore, useAuthStore, CommentsService } from "@/src";
import { Comment } from "@/src/types/api/Comment";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Share, Text, TextInput, View } from "react-native";
import { ArrowLeftIcon, ShareIcon, HeartIcon, PaperAirplaneIcon, TrashIcon, PencilIcon, XMarkIcon, CheckIcon } from "react-native-heroicons/outline";
import { HeartIcon as HeartIconSolid } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ArticleDetails() {
    const { id } = useLocalSearchParams();
    const articleId = Number(id);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
    const isFavorited = useFavoritesStore((s) =>
        s.favorites.some((f) => f.id === articleId && f.type === "news")
    );

    const user = useAuthStore((s) => s.user);

    // Commentaires
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");

    useTrackArticle(article?.id ?? null, "article");

    const fetchComments = useCallback(async () => {
        try {
            const data = await CommentsService.getByArticle(articleId);
            setComments(data);
        } catch (err) {
            console.error("Erreur chargement commentaires", err);
        }
    }, [articleId]);

    const handleSubmitComment = async () => {
        const text = newComment.trim();
        if (!text) return;

        setSubmitting(true);
        try {
            const author = user?.username || "Anonyme";
            const created = await CommentsService.create(articleId, author, text);
            setComments((prev) => [...prev, created]);
            setNewComment("");
        } catch (err) {
            console.error("Erreur envoi commentaire", err);
            Alert.alert("Erreur", "Impossible d'envoyer le commentaire");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = (commentId: number) => {
        Alert.alert("Supprimer", "Voulez-vous supprimer ce commentaire ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer", style: "destructive", onPress: async () => {
                    try {
                        await CommentsService.delete(commentId);
                        setComments((prev) => prev.filter((c) => c.id !== commentId));
                    } catch (err) {
                        console.error("Erreur suppression commentaire", err);
                    }
                },
            },
        ]);
    };

    const startEditing = (comment: Comment) => {
        setEditingId(comment.id);
        setEditText(comment.content);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditText("");
    };

    const handleUpdateComment = async () => {
        if (!editingId || !editText.trim()) return;
        try {
            const updated = await CommentsService.update(editingId, editText.trim());
            setComments((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
            cancelEditing();
        } catch (err) {
            console.error("Erreur modification commentaire", err);
            Alert.alert("Erreur", "Impossible de modifier le commentaire");
        }
    };

    const handleShare = async () => {
        if (!article) return;
        try {
            await Share.share({
                title: article.title,
                message: `${article.title}\n\nLu sur Revue Citoyenne`,
            });
            AnalyticsService.trackEvent("article_share", article.id);
        } catch {}
    };

    const handleFavorite = () => {
        if (!article) return;
        toggleFavorite(article.id, "news");
        AnalyticsService.trackEvent("article_favorite", article.id, {
            metadata: { favorited: !isFavorited },
        });
    };

    const bgColor = isDark ? "#3A1266" : "#F4309820";
    const cardColor = isDark ? "#A1ACD9" : "#F4309820";
    const infoCardColor = isDark ? "#C5CAE9" : "#E7E9F0";
    const commentCardColor = isDark ? "#DCE0F9" : "#F8F9FB";
    const titleColor = isDark ? "#FFF" : "#111";
    const textColor = "#111";
    const secondaryText = "#555";
    const contentText = "#111";

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await ArticlesAPI.getById(articleId);
                setArticle(data);
            } catch (err) {
                console.error("Erreur chargement article", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
        fetchComments();
    }, [articleId, fetchComments]);

    // Couleur d'avatar basée sur le nom
    const getAvatarColor = (name: string) => {
        const colors = ["#F43098", "#6C5CE7", "#00B894", "#E17055", "#0984E3", "#FDCB6E"];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    const formatRelativeDate = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffH = Math.floor(diffMin / 60);
        const diffD = Math.floor(diffH / 24);

        if (diffMin < 1) return "À l'instant";
        if (diffMin < 60) return `Il y a ${diffMin} min`;
        if (diffH < 24) return `Il y a ${diffH}h`;
        if (diffD < 7) return `Il y a ${diffD}j`;
        return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    };

    if (loading) return <ActivityIndicator size="large" color="#F43098" style={{ marginTop: 50 }} />;
    if (!article) return <Text className="text-center text-red-500 mt-10">Article introuvable</Text>;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView style={{ flex: 1, backgroundColor: bgColor }} contentContainerStyle={{ padding: 27, paddingBottom: 60 }}>

                {/* Navigation bar */}
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

                <Text style={{ color: titleColor }} className="text-center text-2xl font-extrabold mb-4 pt-2">
                    {article.title}
                </Text>

                {/* Card 1: Contenu de l'article */}
                <View style={{ backgroundColor: cardColor }} className="p-5 rounded-xl shadow-md mb-6">
                    <Text style={{ color: textColor }} className="text-lg font-bold mb-1">Contenu : </Text>
                    <Text style={{ color: contentText }} className="text-base font-semibold mb-4">{article.content}</Text>
                </View>

                {/* Card 2: Informations à propos l'article */}
                <View style={{ backgroundColor: infoCardColor }} className="p-5 rounded-xl shadow-md mb-6">
                    <Text style={{ color: textColor }} className="text-lg font-bold mb-1">Auteur : </Text>
                    <Text style={{ color: secondaryText }} className="text-base mb-3">{article.user?.username || "Nom à définir"}</Text>

                    <Text style={{ color: textColor }} className="text-lg font-bold mb-1">Publié le : </Text>
                    <Text style={{ color: secondaryText }} className="text-base mb-3">{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "Date inconnue"}</Text>

                    <Text style={{ color: textColor }} className="text-lg font-bold mb-1">Mise à jour : </Text>
                    <Text style={{ color: secondaryText }} className="text-base mb-3">
                        {article.updatedAt ? new Date(article.updatedAt).toLocaleDateString() : "Non définie"}
                    </Text>

                    <Text style={{ color: textColor }} className="text-lg font-bold mb-1">Images : </Text>
                    <Text style={{ color: secondaryText }} className="text-base mb-3">
                        {article.pictures?.length ? `${article.pictures.length} image(s)` : "Aucune image publiée"}
                    </Text>
                </View>

                {/* Card 3: Commentaires */}
                <View style={{ backgroundColor: commentCardColor }} className="p-5 rounded-xl shadow-md">
                    <Text style={{ color: textColor }} className="text-lg font-bold mb-4">
                        Commentaires ({comments.length})
                    </Text>

                    {comments.length === 0 && (
                        <Text style={{ color: "#999", fontStyle: "italic", textAlign: "center" }} className="mb-4">
                            Soyez le premier à commenter
                        </Text>
                    )}

                    {comments.map((c, i) => (
                        <View key={c.id} className="mb-3">
                            <View className="flex-row items-start">
                                {/* Avatar */}
                                <View style={{
                                    width: 36, height: 36, borderRadius: 18,
                                    backgroundColor: getAvatarColor(c.author),
                                    justifyContent: "center", alignItems: "center", marginRight: 10,
                                }}>
                                    <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 15 }}>
                                        {c.author.charAt(0).toUpperCase()}
                                    </Text>
                                </View>

                                {/* Contenu */}
                                <View className="flex-1">
                                    <View className="flex-row items-center justify-between">
                                        <Text style={{ color: textColor, fontWeight: "bold", fontSize: 14 }}>
                                            {c.author}
                                        </Text>
                                        <View className="flex-row items-center" style={{ gap: 8 }}>
                                            <Text style={{ color: "#999", fontSize: 12 }}>
                                                {formatRelativeDate(c.createdAt)}
                                            </Text>
                                            {editingId !== c.id && (
                                                <>
                                                    <Pressable onPress={() => startEditing(c)}>
                                                        <PencilIcon size={14} color="#0984E3" />
                                                    </Pressable>
                                                    <Pressable onPress={() => handleDeleteComment(c.id)}>
                                                        <TrashIcon size={14} color="#E74C3C" />
                                                    </Pressable>
                                                </>
                                            )}
                                        </View>
                                    </View>

                                    {editingId === c.id ? (
                                        <View className="flex-row items-center mt-2" style={{ gap: 6 }}>
                                            <TextInput
                                                value={editText}
                                                onChangeText={setEditText}
                                                className="flex-1 rounded-lg px-3"
                                                style={{
                                                    color: "#111", backgroundColor: "#FFF",
                                                    height: 36, borderWidth: 1, borderColor: "#0984E3",
                                                    fontSize: 14,
                                                }}
                                                autoFocus
                                                onSubmitEditing={handleUpdateComment}
                                                returnKeyType="done"
                                            />
                                            <Pressable onPress={handleUpdateComment} style={{
                                                width: 32, height: 32, borderRadius: 16,
                                                backgroundColor: "#0984E3",
                                                justifyContent: "center", alignItems: "center",
                                            }}>
                                                <CheckIcon size={16} color="#FFF" />
                                            </Pressable>
                                            <Pressable onPress={cancelEditing} style={{
                                                width: 32, height: 32, borderRadius: 16,
                                                backgroundColor: "#E0E0E0",
                                                justifyContent: "center", alignItems: "center",
                                            }}>
                                                <XMarkIcon size={16} color="#555" />
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <Text style={{ color: secondaryText, fontSize: 14, marginTop: 2 }}>
                                            {c.content}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            {i < comments.length - 1 && (
                                <View className="h-[1px] bg-gray-200 mt-3 ml-12" />
                            )}
                        </View>
                    ))}

                    {/* Champ de saisie */}
                    <View className="flex-row items-center mt-3" style={{ gap: 8 }}>
                        <TextInput
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholder="Écrire un commentaire..."
                            placeholderTextColor="#999"
                            className="flex-1 rounded-full px-4 text-sm"
                            style={{
                                color: "#111",
                                backgroundColor: "#FFF",
                                height: 40,
                                borderWidth: 1,
                                borderColor: "#E0E0E0",
                            }}
                            editable={!submitting}
                            onSubmitEditing={handleSubmitComment}
                            returnKeyType="send"
                        />
                        <Pressable
                            onPress={handleSubmitComment}
                            disabled={submitting || !newComment.trim()}
                            style={{
                                width: 40, height: 40, borderRadius: 20,
                                backgroundColor: newComment.trim() ? "#F43098" : "#CCC",
                                justifyContent: "center", alignItems: "center",
                            }}
                        >
                            {submitting ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <PaperAirplaneIcon size={18} color="#FFF" />
                            )}
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
