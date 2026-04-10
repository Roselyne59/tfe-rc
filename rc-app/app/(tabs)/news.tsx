import ArticleCard from "@/components/cards/NewsCard";
import Header from "@/components/ui/headers/PlatformHeader";
import AuthModal from "@/components/ui/modals/AuthModal";
import SectionTitle from "@/components/ui/SectionTitle";
import { useDataStore, Article, AnalyticsService } from "@/src";

import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, Text, TextInput, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function NewsScreen() {
  const searchInputRef = useRef<TextInput>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { news, fetchNews, loading } = useDataStore();
  useEffect(() => {
    fetchNews();
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
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ?"#3A1266" : "#F4309820" }}>
      <View className="flex-1 px-4" >
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
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <SectionTitle title="Tous les articles" />
          {loading && <Text> ⏳ Chargement des articles... </Text>}
          {news.map((article) => {
              return <ArticleCard key={article.id} article={article} onPress={() => AnalyticsService.trackEvent("article_card_click", article.id)} />;
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}