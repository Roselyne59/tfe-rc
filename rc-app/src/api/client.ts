import axios from "axios";

// ✅ Configuration d'URL centralisée
const getBaseURL = () => {
    if (__DEV__) {
        // ✅ Pour appareil physique iOS/Android - utilisez l'IP de votre Mac
        return "http://192.168.8.124:3000";
        
        // Alternative pour émulateur (si vous testez sur émulateur, décommentez la ligne suivante)
        // return "http://localhost:3000";
        
        // Alternative pour émulateur Android (si vous utilisez l'émulateur Android)
        // return "http://10.0.2.2:3000";
    }
    
    // Production - remplacez par votre URL de production
    return "https://your-production-api.com";
};

//Création instance Axios
const baseURL = getBaseURL();
console.log("🌐 API Base URL:", baseURL);

// Test de connectivité au démarrage
const testConnection = async () => {
    try {
        console.log("🔍 Test de connectivité vers:", baseURL);
        const response = await fetch(`${baseURL}`, {
            method: 'GET',
            timeout: 5000 
        });
        if (response.ok) {
            console.log("✅ Serveur accessible");
        } else {
            console.warn("⚠️ Serveur répond mais avec status:", response.status);
        }
    } catch (error) {
        console.error("❌ Serveur inaccessible:", error.message);
        console.error("💡 Vérifiez que votre serveur backend est démarré sur:", baseURL);
    }
};

// Exécuter le test uniquement en développement
if (__DEV__) {
    testConnection();
}

const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Client-Type" : "mobile",
    }, 
    timeout: 10000, // 10 secondes
});

//Intercepteur ajoutant le token JWT
export const setAuthToken = (token?: string) => {
    if (token) {
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.Authorization;
    }
};

export default apiClient;
