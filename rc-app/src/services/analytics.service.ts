import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { AnalyticsAPI, AnalyticsEventDto } from "@/src/api/analytics";

const ANONYMOUS_ID_KEY = "analytics_anonymous_id";
const EVENT_BUFFER_KEY = "analytics_event_buffer";
const FLUSH_INTERVAL_MS = 30_000; // 30 secondes
const MAX_BUFFER_SIZE = 20;

// Génération d'un UUID v4
function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

let anonymousId: string | null = null;
let eventBuffer: AnalyticsEventDto[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

// Récupère ou crée l'identifiant anonyme (persisté dans AsyncStorage)
async function getAnonymousId(): Promise<string> {
    if (anonymousId) return anonymousId;

    const stored = await AsyncStorage.getItem(ANONYMOUS_ID_KEY);
    if (stored) {
        anonymousId = stored;
        return stored;
    }

    const newId = generateUUID();
    await AsyncStorage.setItem(ANONYMOUS_ID_KEY, newId);
    anonymousId = newId;
    return newId;
}

// Envoie les événements en attente au backend
async function flushEvents(): Promise<void> {
    if (eventBuffer.length === 0) return;

    const eventsToSend = [...eventBuffer];
    eventBuffer = [];

    try {
        await AnalyticsAPI.sendEvents(eventsToSend);
    } catch (err) {
        // En cas d'erreur réseau, remettre les événements dans le buffer
        eventBuffer = [...eventsToSend, ...eventBuffer];
        // Persister le buffer pour ne pas perdre les événements
        await AsyncStorage.setItem(EVENT_BUFFER_KEY, JSON.stringify(eventBuffer));
    }
}

// Restaure le buffer depuis AsyncStorage (événements non envoyés)
async function restoreBuffer(): Promise<void> {
    try {
        const stored = await AsyncStorage.getItem(EVENT_BUFFER_KEY);
        if (stored) {
            eventBuffer = JSON.parse(stored);
            await AsyncStorage.removeItem(EVENT_BUFFER_KEY);
        }
    } catch {
        // Ignorer les erreurs de parsing
    }
}

export const AnalyticsService = {
    // Initialise le service : restaure le buffer et démarre le flush périodique
    async init(): Promise<void> {
        await restoreBuffer();
        if (!flushTimer) {
            flushTimer = setInterval(flushEvents, FLUSH_INTERVAL_MS);
        }
    },

    // Enregistre un événement dans le buffer
    async trackEvent(
        eventType: string,
        articleId: number,
        options?: { duration?: number; metadata?: Record<string, any> },
    ): Promise<void> {
        const anonId = await getAnonymousId();

        eventBuffer.push({
            eventType,
            articleId,
            anonymousId: anonId,
            duration: options?.duration,
            metadata: {
                platform: Platform.OS,
                ...options?.metadata,
            },
        });

        // Flush automatique si le buffer est plein
        if (eventBuffer.length >= MAX_BUFFER_SIZE) {
            await flushEvents();
        }
    },

    // Force l'envoi immédiat (à appeler quand l'app passe en arrière-plan)
    async flush(): Promise<void> {
        await flushEvents();
    },
};
