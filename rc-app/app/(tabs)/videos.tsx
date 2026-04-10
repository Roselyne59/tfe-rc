import CapsuleVideoCard from "@/components/cards/VideosCard";
import Header from "@/components/ui/headers/PlatformHeader";
import AuthModal from "@/components/ui/modals/AuthModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { useDataStore, AnalyticsService } from "@/src";

import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, Text, TextInput, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function VideoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const searchInputRef = useRef<TextInput>(null);

  const { videos, fetchVideos, loading } = useDataStore();
  useEffect(() => {
    fetchVideos();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const fadeModalContent = useRef(new Animated.Value(0)).current;

  useEffect(() => {
      if (modalVisible) {
        fadeModalContent.setValue(0);
        Animated.timing(fadeModalContent, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      } else {
        fadeModalContent.setValue(0);
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
        
        {/* Modal */}
        <AuthModal 
          visible={modalVisible}
          onClose={closeModalWithFade}
          isDark={isDark}
          fadeModalContent={fadeModalContent}
        />

        <ScrollView
          onScroll={() => {}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <SectionTitle title="Toutes les vidéos "/>
          {loading && <Text> ⏳ Chargement des vidéos... </Text>}
          {videos.map((videoItem) => {
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
              return <CapsuleVideoCard key={enrichedVideo.id} video={enrichedVideo} onPress={() => AnalyticsService.trackEvent("video_card_click", videoItem.id)} />
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}