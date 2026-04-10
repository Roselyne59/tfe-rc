import { LoginDto, useAuthStore } from "@/src";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated, Image, Keyboard, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, TextInput as RNTextInput, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View
} from "react-native";
import LogoutButton from "../LogoutButton";

type AuthModalProps = {
    visible: boolean;
    onClose: () => Promise<void>;
    isDark: boolean;
    fadeModalContent: Animated.Value;
};

export default function AuthModal({ visible, onClose, isDark, fadeModalContent, }: AuthModalProps) {
        const router = useRouter();
        const emailRef = useRef<RNTextInput>(null);
        const passwordRef = useRef<RNTextInput>(null);

        const [emailOrPseudo, setEmailOrPseudo] = useState('');
        const [password, setPassword] = useState('');
        const [showPassword, setShowPassword] = useState(false);
        const [showSuccessMessage, setShowSuccessMessage] = useState(false);
        const {user, login, logout} = useAuthStore();
        const [errors, setErrors] = useState<{email?: string; password?: string}> ({});
        const [authError, setAuthError] = useState<string | null>(null);
        const [animationFinished, setAnimationFinished] = useState(false);

        const fadeAnim = useRef(new Animated.Value(0)).current; //Animation pour la notification de connexion de l'utilisateur
        const fadeLogoutAnim = useRef(new Animated.Value(0)).current; // Animation de l'apparition du bouton de déconnexion

        /* Validation des champs */
        const validate = () => {
            const newErrors: typeof errors = {};
            if (!emailOrPseudo.trim()) {
                newErrors.email = "Veuillez entrez votre adresse mail ou votre pseudo";
            } else if (
                !/\S+@\S+\.\S+/.test(emailOrPseudo) && // Adresse mail invalide
                !/^[a-zA-Z0-9_]+$/.test(emailOrPseudo) // Pseudo invalide
            ) {
                newErrors.email = "Pseudo ou adresse mail incorrect";
            }
            if (!password.trim()) {
                newErrors.password = "Veuillez entrez un mot de passe";
            } else if (password.length < 8) {
                newErrors.password = "Le mot de passe doit contenir minium 8 caractères"
            }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        /* Réinitialisation du formulaire */
        const resetForm = (resetFields = true) => {
            if (resetFields) {
            setEmailOrPseudo('');
            setPassword('');
            }
            setErrors({});
            setAuthError(null);
        };

        /* Connexion via API (store login → AuthAPI.login) */
        const handleLogin = async () => {
            if (!validate()) return; // ✅ CORRECTION: retourne seulement si la validation échoue
            try {
                // Détection automatique : email ou username
                const isEmail = emailOrPseudo.includes('@');
                const loginData: LoginDto = isEmail 
                    ? { email: emailOrPseudo, password }
                    : { username: emailOrPseudo, password };
                
                console.log("🔐 Type de connexion détecté:", isEmail ? "email" : "username");
                await login(loginData);
                setShowSuccessMessage(true);
                resetForm(false);
                Keyboard.dismiss();
            } catch (err) {
                setAuthError("❌ Identifiants incorrects !");
                console.error("Erreur AuthModal → handlelogin :", err);
            }
        };
        
        /* Animation de la notification après connexion */
        useEffect(() => {
            if (showSuccessMessage) {
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
            // Disparition de la notification après connexion de l'utilisateur
            const timeout = setTimeout(() => {
                Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
                    setShowSuccessMessage(false); // Masquer la notification
                    setAnimationFinished(true); // Affiche le bouton "Se déconnecter" après la disparition de la notification
                        //Animation pour le bouton "Se déconnecter"
                        Animated.timing(fadeLogoutAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
                    });
                }, 2000);
                return () => clearTimeout(timeout);
            }
        }, [showSuccessMessage]);

        /* Affichage direct de la déconnexion si l'utilisateur est déjà connecté */
        useEffect(() => {
            if (visible && user && !animationFinished) {
                setAnimationFinished(true);
                Animated.timing(fadeLogoutAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
            }
        }, [visible, user, animationFinished]);

        /* Réinitialisation quand l’utilisateur se déconnecte */
        useEffect(() => {
            if (!user && visible) {
                onClose();
                resetForm();
                setAnimationFinished(false);
                fadeLogoutAnim.setValue(0);
            }
        }, [user]);

        return (
            <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onClose(); }}>
                    <View style={{ flex: 1 }}>
                        <BlurView
                            intensity={60}
                            tint={isDark ? "dark" : "light"}
                            style={{ flex: 1, justifyContent: "center", padding: 20 }}
                        >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={{ flex: 1, justifyContent: "center" }}
                            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
                        >
                            <TouchableWithoutFeedback>
                                <Animated.View
                                    style={{
                                        opacity: fadeModalContent,
                                        transform: [{ translateY: fadeModalContent.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
                                        backgroundColor: isDark ? "#C6D2" : "#F4309820",
                                        borderRadius: 20,
                                        padding: 24,
                                    }}
                                >
                                {/* Message lorsque l'utilisateur est connecté */}
                                {user && <Text style={{ color: isDark ? "#E0E7FF" : "#000", fontSize: 27, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>Bienvenue {user.username} 👋</Text>}

                                {/* Formulaire de connexion */}
                                {!user && (
                                    <>
                                    <Text 
                                        style={{ color: isDark ? "#E0E7FF" : "#000", fontSize: 30, fontWeight: "bold", marginBottom: 5 }}
                                        className="text-3xl font-extrabold text-center mb-4"
                                    >
                                        Connexion
                                    </Text>
                                    
                                    {/* Lien d'inscription */}
                                    <Pressable
                                        onPress={async () => {
                                        await onClose();
                                        router.push("/register?fromModal=true");
                                        }}
                                        style={{ borderRadius: 99, padding: 10 }}
                                    >
                                        <Text 
                                            style={{ color: isDark ? "#9FAEFF" : "#F43098", textAlign: "center", fontSize: 17, fontWeight: "bold" }}
                                        >
                                            Vous n'avez pas de compte ? Inscrivez-vous !
                                        </Text>
                                    </Pressable>

                                    {/* Champ Email/Pseudo */}
                                    <View
                                        className="h-12 rounded-full px-4 flex-row items-center mb-2 justify-between"
                                        style={{ backgroundColor: isDark ? "#E0E7FF" : "#FCF2FD", borderColor: errors.email ? "#F82834" : "transparent", borderWidth: errors.email ? 1.5 : 0 }}
                                    >
                                        <Text style={{ color: "#555", fontSize: 20 }}>@ </Text>
                                        <TextInput
                                            ref={emailRef}
                                            placeholder="Email ou pseudo"
                                            placeholderTextColor="#555"
                                            className="flex-1 font-bold"
                                            value={emailOrPseudo}
                                            onChangeText={setEmailOrPseudo}
                                            returnKeyType="next"
                                            onSubmitEditing={() => passwordRef.current?.focus()}
                                        />
                                        {errors.email && <Text style={{ color: "#F82834", fontSize: 16, marginLeft: 6 }}>❗</Text>}
                                    </View>
                                    {errors.email && <Text style={{ color: "#F82834", fontSize: 12 }}>{errors.email}</Text>}

                                    {/* Champ Mot de passe */}
                                    <View
                                        className="h-12 rounded-full px-4 flex-row items-center mb-2 justify-between"
                                        style={{ backgroundColor: isDark ? "#E0E7FF" : "#FCF2FD", borderColor: errors.password ? "#F82834" : "transparent", borderWidth: errors.password ? 1.5 : 0 }}
                                    >
                                        <Text style={{ color: "#555", fontSize: 20 }}>🔒</Text>
                                        <TextInput
                                            ref={passwordRef}
                                            placeholder="Mot de passe"
                                            placeholderTextColor="#555"
                                            secureTextEntry={!showPassword}
                                            style={{ flex: 1, color: isDark ? "#ccc" : "#555", fontWeight: "bold" }}
                                            value={password}
                                            onChangeText={setPassword}
                                            returnKeyType="done"
                                            onSubmitEditing={handleLogin}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Text style={{ fontSize: 20 }}>{showPassword ? "🙈" : "👁️"}</Text>
                                        </TouchableOpacity>
                                        {errors.password && <Text style={{ color: "#F82834", fontSize: 16 }}>❗</Text>}
                                    </View>
                                    {errors.password && <Text style={{ color: "#F82834", fontSize: 12 }}>{errors.password}</Text>}

                                    {/* Bouton de connexion */}
                                    <Pressable
                                        onPress={handleLogin}
                                        style={{ backgroundColor: isDark ? "#E0E7FF" : "#FCF2FD", borderRadius: 99, padding: 10, marginBottom: 20 }}
                                    >
                                        <Text style={{ color: "#000", textAlign: "center" }} className="font-semibold">Se connecter</Text>
                                    </Pressable>
                                    {authError && <Text style={{ color: "#F82834", fontSize: 13, textAlign: "center" }}>{authError}</Text>}
                                    </>
                                    )}  

                                    {/* Connexion utilisateur avec notification */}
                                    {user && showSuccessMessage && (
                                        <Animated.View 
                                            style={{ opacity: fadeAnim, backgroundColor: "#DCFCE7", borderRadius: 10, padding: 15, alignItems: "center", marginBottom: 20 }}>
                                            <Text style={{ fontSize: 22, fontWeight: "bold", color: "#15803D" }}>✅ Connexion réussie !</Text>
                                            <Text style={{ fontSize: 16, color: "#15803D" }}>Bienvenue {user.username} 👋</Text>
                                        </Animated.View>
                                    )}

                                    {/* Bouton de déconnexion */}
                                    {user && animationFinished && (
                                        <Animated.View style={{ opacity: fadeLogoutAnim }}>
                                            <LogoutButton />
                                        </Animated.View>
                                    )}

                                    {/* Réseaux sociaux & mail de contact */}
                                    <Text
                                        style={{ color: isDark ? "#E0E7FF" : "#000", fontSize: 25, marginBottom: 10 }}
                                        className="text-2xl font-bold text-center"
                                    >
                                        Réseaux sociaux
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "center", gap: 15, marginBottom: 20 }}>
                                        {[
                                            {
                                                source: require("@/assets/images/ui/facebook.jpg"),
                                                url: "https://www.facebook.com/profile.php?id=61577895856862",
                                            },
                                            {
                                                source: require("@/assets/images/ui/instagram.jpg"),
                                                url: "https://www.instagram.com/revue_citoyenne/",
                                            },
                                            {
                                                source: require("@/assets/images/ui/tiktok.png"),
                                                url: "https://www.tiktok.com/@revue_citoyenne",
                                            },
                                            {
                                                source: require("@/assets/images/ui/youtube.png"),
                                                url: "https://www.youtube.com/channel/UCoenuwjGdZ3gT2lvKHbMpCg",
                                            },
                                        ].map((item, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            onPress={() => Linking.openURL(item.url)}
                                            style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: isDark ? "#35084E" : "#C0287A", alignItems: "center", justifyContent: "center" }}
                                        >
                                            <Image source={item.source} style={{ width: 22, height: 22, resizeMode: "contain" }}/>
                                        </TouchableOpacity>
                                        ))}
                                    </View>

                                    <TouchableOpacity onPress={() => Linking.openURL("mailto:contact@revue-citoyenne.be")}>
                                        <Text
                                            style={{ color: isDark ? "#9FAEFF" : "#F43098", textAlign: "center", fontSize: 19, marginBottom: 20, textDecorationLine: "underline" }}
                                            className="font-bold"
                                        >
                                        contact@revue-citoyenne.be
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                    </BlurView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}