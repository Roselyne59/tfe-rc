import AuthAPI from "@/src/api/auth";
import { setAuthToken } from "@/src/api/token.util";
import { LoginDto, LoginResponse, RegisterDto, RegisterResponse } from "@/src/types/api/Auth";
import { User } from "@/src/types/api/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStore = {
    user: User | null;
    token: string | null;
    login: (credentials: LoginDto) => Promise<void>;
    register: (data: RegisterDto) => Promise<void>;
    logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,

            // ✅ LOGIN : utilise data.user et data.access_token
            login: async (credentials) => {
                try {
                    console.log("🔐 Tentative de connexion avec:", credentials.username ? 
                        { username: credentials.username } : 
                        { email: credentials.email });
                    const res: LoginResponse = await AuthAPI.login(credentials);
                    console.log("📡 Réponse reçue du serveur:", res);
                    
                    // Vérification de la structure de la réponse pour éviter l'erreur
                    if (!res) {
                        console.error("❌ Aucune réponse reçue:", res);
                        throw new Error("Aucune réponse du serveur");
                    }
                    
                    // Adaptation à la vraie structure de votre serveur
                    let user = null;
                    let access_token = null;
                    
                    if (res.data && res.data.user && res.data.access_token) {
                        // Structure attendue par le type LoginResponse
                        user = res.data.user;
                        access_token = res.data.access_token;
                    } else if (res.accessToken) {
                        // Structure réelle de votre serveur
                        access_token = res.accessToken;
                        // Décoder le JWT pour extraire les infos utilisateur
                        try {
                            const payload = JSON.parse(atob(res.accessToken.split('.')[1]));
                            user = {
                                id: payload.sub,
                                username: payload.username,
                                email: payload.email,
                                role: payload.role
                            };
                        } catch (jwtError) {
                            console.error("❌ Erreur décodage JWT:", jwtError);
                            throw new Error("Token JWT invalide");
                        }
                    } else {
                        console.error("❌ Structure de réponse non reconnue:", res);
                        throw new Error("Structure de réponse invalide");
                    }
                    
                    console.log("✅ Données extraites:", { user: user?.username, hasToken: !!access_token });

                    set({ user, token: access_token ?? null });
                    if (access_token) setAuthToken(access_token); // applique le token globalement
                } catch (err) {
                    console.error("❌Erreur de connexion:", err);
                    throw err;
                }
            },

            // ✅ REGISTER : stocke uniquement l'utilisateur (pas de token renvoyé)
            register: async (data) => {
                try {
                    console.log("📝 Tentative d'inscription avec:", { username: data.username, email: data.email });
                    const res: RegisterResponse = await AuthAPI.register(data);
                    console.log("📡 Réponse d'inscription reçue:", res);
                    
                    // Vérification de la structure de la réponse
                    if (!res || !res.data) {
                        console.error("❌ Structure de réponse d'inscription invalide:", res);
                        throw new Error("Réponse du serveur invalide lors de l'inscription");
                    }
                    
                    console.log("✅ Utilisateur créé:", res.data);
                    set({ user: res.data, token: null }); // pas de token à l'inscription
                } catch (err) {
                    console.error("❌Erreur d'inscription:", err);
                    throw err;
                }
            },

            // ✅ LOGOUT : supprime user, token et en-têtes globaux
            logout: () => {
                set({ user: null, token: null });
                setAuthToken(undefined);
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);