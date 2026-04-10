import ArticleCard from "@/components/cards/NewsCard";
import CapsuleVideoCard from "@/components/cards/VideosCard";
import Header from "@/components/ui/headers/PlatformHeader";
import AuthModal from "@/components/ui/modals/AuthModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { useModalStore, AnalyticsService, ArticleService } from "@/src";
import { Article } from "@/src/types/api/Article";

import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, TextInput as RNTextInput, ScrollView, Text, useColorScheme, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const searchInputRef = useRef<RNTextInput>(null);
  const insets = useSafeAreaInsets();

  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [latestVideos, setLatestVideos] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const articles = await ArticleService.getAll();
        setLatestNews(articles.filter((a) => a.type === "news"));
        setLatestVideos(articles.filter((a) => a.type === "videos"));
      } catch (err) {
        console.error("❌ Erreur chargement accueil :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  //Gestion de la modal
  const fadeModalContent = useRef(new Animated.Value(0)).current; // Animation pour la fermeture de la modal
  const shouldOpenModal = useModalStore((s) => s.shouldOpenModal);
  const setShouldOpenModal = useModalStore((s) => s.setShouldOpenModal);

  useEffect(() => {
    if(shouldOpenModal) {
      setModalVisible(true);
      setShouldOpenModal(false);
    }
  }, [shouldOpenModal, setShouldOpenModal]);

  useEffect(() => {
    if (modalVisible) {
      fadeModalContent.setValue(0);
      Animated.timing(fadeModalContent, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);
  
  const closeModalWithFade = () => {
    return new Promise<void>((resolve) => {
      Animated.timing(fadeModalContent, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setModalVisible(false);
          resolve();
        }, 100);
      });
    });
  };


  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? "#3A1266" : "#F4309820" }}>
    <View className="flex-1 px-4">
      <Header 
        isDark={isDark}
        searchInputRef={searchInputRef}
        onMenuPress={() => setModalVisible(true)}
      />
      
      <AuthModal 
        visible={modalVisible}
        onClose={closeModalWithFade}
        isDark={isDark}
        fadeModalContent={fadeModalContent}
      />

      {/* Contenu */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <SectionTitle title="Dernier article posté :" />
        {loading && <View><Text> ⏳ Chargement... </Text></View>}

        {latestNews.map((newsItem) => {
          const enrichedArticle = {
            id: newsItem.id,
            title: newsItem.title,
            content: newsItem.content,
            description: newsItem.description,
            pictures: newsItem.pictures ?? [],
            createdAt: newsItem.createdAt,
            updatedAt: newsItem.updatedAt,
            isActive: true,
            type: "news" as const,
        };

          return (
              <Link key={newsItem.id} href={`/news/${newsItem.id}`} asChild>
                <Pressable onPress={() => AnalyticsService.trackEvent("article_card_click", newsItem.id)}>
                  <ArticleCard article={enrichedArticle} />
                </Pressable>
              </Link>
            );
          })}

        <SectionTitle title="Dernière vidéo postée :" />
        {latestVideos.map((videoItem) => {
          const enrichedVideo = {
            id: videoItem.id,
            title: videoItem.title,
            description: videoItem.content,
            thumbnailUrl: videoItem.thumbnailUrl ?? "",
            videoUrl: videoItem.videoUrl ?? "",
            createdAt: videoItem.createdAt,
            uploadedAt: videoItem.updatedAt,
            type: "videos" as const,
        };
        return (
            <Link key={videoItem.id} href={`/videos/${videoItem.id}`} asChild>
              <Pressable onPress={() => AnalyticsService.trackEvent("video_card_click", videoItem.id)}>
                <CapsuleVideoCard video={enrichedVideo} />
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}