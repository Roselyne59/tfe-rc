import apiClient from "@/src/api/client";
import { LoginDto, LoginResponse, RegisterDto, RegisterResponse } from "@/src/types/api/Auth";

export const AuthService = {
    async login(credentials: LoginDto): Promise<LoginResponse> {
        const { data } = await apiClient.post<LoginResponse>("/auth/login", credentials);
        return data;
    },

    async register(user: RegisterDto): Promise<RegisterResponse> {
        console.log("🌐 API Base URL utilisée:", apiClient.defaults.baseURL);
        console.log("📤 Données envoyées à /users:", user);
        console.log("🔗 URL complète:", `${apiClient.defaults.baseURL}/users`);
        
        try {
            const response = await apiClient.post<RegisterResponse>("/users", user);
            console.log("✅ Réponse brute reçue:", response);
            console.log("📦 Data de la réponse:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Erreur détaillée lors de l'inscription:");
            if (error.response) {
                console.error("📊 Status:", error.response.status);
                console.error("📋 Headers:", error.response.headers);
                console.error("💬 Data:", error.response.data);
                console.error("🔗 URL appelée:", error.config?.url);
            } else if (error.request) {
                console.error("📡 Aucune réponse reçue:", error.request);
            } else {
                console.error("⚙️ Erreur de configuration:", error.message);
            }
            throw error;
        }
    },

    async getProfile(): Promise<any> {
        const { data } = await apiClient.get("/auth/profile");
        return data;
    }
};