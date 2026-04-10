import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FavoriteItem = {
    id: number;
    type: "news" | "videos";
};

type FavoritesStore = {
    favorites: FavoriteItem[];
    isFavorite: (id: number, type: "news" | "videos") => boolean;
    toggleFavorite: (id: number, type: "news" | "videos") => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
    persist(
        (set, get) => ({
            favorites: [],

            isFavorite: (id, type) => {
                return get().favorites.some((f) => f.id === id && f.type === type);
            },

            toggleFavorite: (id, type) => {
                const exists = get().favorites.some((f) => f.id === id && f.type === type);
                if (exists) {
                    set({ favorites: get().favorites.filter((f) => !(f.id === id && f.type === type)) });
                } else {
                    set({ favorites: [...get().favorites, { id, type }] });
                }
            },
        }),
        {
            name: "favorites-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
