import { RegisterDto, useAuthStore, useModalStore } from "@/src";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const isDark = useColorScheme() === "dark";
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { fromModal } = useLocalSearchParams();
    const register = useAuthStore((state) => state.register);

    // Champs du formulaire
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [birthDate, setBirthDate] = useState<Date | undefined>();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [country, setCountry] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [newsletter, setNewsltter] = useState(false);

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const firstNameRef = React.useRef<TextInput>(null);
    const usernameRef = React.useRef<TextInput>(null);
    const emailRef = React.useRef<TextInput>(null);
    const passwordRef = React.useRef<TextInput>(null);
    const confirmPasswordRef = React.useRef<TextInput>(null);
    const birthDateRef = React.useRef<TextInput>(null);
    const scrollViewRef = React.useRef<ScrollView>(null);
    const formatDate = (date: Date | undefined) => {
        if (!date) return "";
        return date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // Navigation vers la section pays après sélection de date
    const navigateToCountrySection = () => {
        setShowDatePicker(false);
        // Petit délai pour que le modal se ferme avant le scroll
        setTimeout(() => {
            // Scroll vers la section pays (approximativement où elle se trouve)
            scrollViewRef.current?.scrollTo({ y: 700, animated: true });
        }, 300);
    };

    /* Validation */
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const validate = () => {
        const newErrors: { [key: string]: string} = {};
        if (!lastName.trim()) newErrors.lastName = "Veuillez entrez un nom";
        if (!firstName.trim()) newErrors.firstName ="Veuillez entrez un prénom";
        if (!username.trim()) newErrors.username ="Veuillez entrez un pseudo";
        if (!email.trim()) newErrors.email = "Veuillez entrez une adresse mail";
        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email ="Adresse mail invalide";
        if (!password) newErrors.password = "Veuillez entrez un mot de passe";
        if (password.length < 8) newErrors.password = "Le mot de passe doit contenir minimum 8 caractères";
        if (confirmPassword !== password) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        if (!birthDate) newErrors.birthDate = "Veuillez entrez une date de naissance";
        if (!country) newErrors.country = "Veuillez sélectionner un pays";
        if (!gender) newErrors.gender ="Veuillez sélectionner un genre";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* Soumission du formulaire */
    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);
        setApiError(null);

        try {
            const dto: RegisterDto = {
                username,
                email,
                password,
            };

            await register(dto);

            /* Redirection si connexion réussie */
            if (fromModal === "true") {
                useModalStore.getState().setShouldOpenModal(true);
                router.replace("/");// retour home & connexion de la modal
            } else {
                router.replace("/"); // redirection uniquement sur home
            }
        } catch (err: any) {
            console.error("Erreur lors de l'inscription... ", err);
            setApiError("Impossible de créer le compte. Veuillez réessayez");
        } finally {
            setLoading(false);
        }
    };

    /* Retour modal login après inscription (si depuis AuthModal) */
    useEffect(() => {
        return () => {
            if (fromModal === "true") {
                useModalStore.getState().setShouldOpenModal(true);
            }
        };
    }, [fromModal]);

    const inputStyle = {
        backgroundColor: isDark ? "#E0E7FF" : "#FCF2FD",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 30,
        fontWeight: "bold" as const,
        color: "#555",
        marginBottom: 12,
    };

    const labelStyle = {
        fontSize: 16,
        fontWeight: "bold" as const,
        marginBottom: 4,
        color: isDark ? "#fff" : "#000",
    };

    return(
        <TouchableWithoutFeedback onPress={() => { if (!showDatePicker) Keyboard.dismiss();  }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? "#3A1266" : "#F4309820", paddingTop: insets.top }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1, paddingHorizontal: 7 }}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{ padding: 20 }}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={{ fontSize: 26, fontWeight: "bold", color: isDark ? "#fff" : "#000", textAlign: "center", marginBottom: 30 }}>Inscription</Text>

                        {fromModal === "true" && (
                            <View style={{ marginBottom: 25 }}>
                                <Text style={{ color: "#F43098", fontWeight: "bold" }}> 
                                    <Text onPress={() => router.replace("/")}>
                                        ←Home
                                    </Text>
                                </Text>
                            </View>           
                        )}

                        {/* Champs du formulaire */}
                        {/* Nom */}
                        <Text style={labelStyle}>Nom :</Text>
                        <TextInput 
                            style={inputStyle}
                            placeholder="Veuillez saisir votre nom"
                            placeholderTextColor="#888"
                            value={lastName}
                            onChangeText={setLastName}
                            returnKeyType="next"
                            onSubmitEditing={() => firstNameRef.current?.focus()}
                        />
                        {errors.lastName && (
                            <Text style={{ color: "#F82834", fontSize: 12, marginBottom: 8}}>
                                {errors.lastName} ❗
                            </Text>
                        )}

                        {/* Prénom */}
                        <Text style={labelStyle}>Prénom :</Text>
                        <TextInput 
                            ref={firstNameRef}
                            style={inputStyle}
                            placeholder="Veuillez saisir votre prénom"
                            placeholderTextColor="#888"
                            value={firstName}
                            onChangeText={setFirstName}
                            returnKeyType="next"
                            onSubmitEditing={() => usernameRef.current?.focus()}
                        />
                        {errors.firstName && (
                            <Text style={{ color: "#F82834", fontSize: 12, marginBottom: 8}}>
                                {errors.firstName} ❗
                            </Text>
                        )}

                        {/* Pseudo */}
                        <Text style={labelStyle}>Pseudo :</Text>
                        <TextInput
                            ref={usernameRef}
                            style={inputStyle}
                            placeholder="Veuillez saisir un nom pseudo"
                            placeholderTextColor="#888"
                            value={username}
                            onChangeText={setUsername}
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current?.focus()}
                        />
                        {errors.username && (
                            <Text style={{ color: "#F82834", fontSize: 12, marginBottom: 8}}>
                                {errors.username} ❗
                            </Text>
                        )}

                        {/* Email */}
                        <Text style={labelStyle}>Email :</Text>
                        <TextInput
                            ref={emailRef}
                            style={inputStyle}
                            placeholder="exemple@email.com"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />
                        {errors.email && (
                            <Text style={{ color: "#F82834", fontSize: 12, marginBottom: 8}}>
                                {errors.email} ❗
                            </Text>
                        )}

                        {/* Password */}
                        <Text style={labelStyle} >Mot de passe :</Text>
                        <View style={{ position: "relative" }}>
                        <TextInput 
                            ref={passwordRef}
                            style={[inputStyle, { paddingRight: 50 }]}
                            placeholder="Veuillez saisir un mot de passe"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            returnKeyType="next"
                            onSubmitEditing={() => confirmPasswordRef.current?.focus()} 
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: 22,
                                top: 12,
                            }}
                        >
                            <Text style={{ fontSize: 20, color: "#F43098" }}>
                                {showPassword ? "🙈" : "👁️" }
                            </Text>
                        </TouchableOpacity>
                        </View>
                        {errors.password && (
                            <Text style={{ color: "#F82834", fontSize: 12, marginBottom: 8}}>
                                {errors.password} ❗
                            </Text>
                        )}

                        {/* Confirm password */}
                        <Text style={labelStyle}>Confirmer le mot de passe :</Text>
                        <View style={{ position: "relative" }}>
                        <TextInput 
                            ref={confirmPasswordRef}
                            style={[inputStyle, { paddingRight: 50 }]}
                            placeholder="Confirmez votre mot de passe"
                            placeholderTextColor="#888"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            returnKeyType="next"
                            onSubmitEditing={() => birthDateRef.current?.focus()}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                                position: "absolute",
                                right: 22,
                                top: 12,
                            }}
                        >
                            <Text style={{ fontSize: 20, color: "#F43098" }}>
                                {showConfirmPassword ? "🙈" : "👁️" }
                            </Text>
                        </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && (
                            <Text style={{ color: "#F82834", fontSize: 12, marginBottom: 8}}>
                                {errors.confirmPassword} ❗
                            </Text>
                        )}

                        {/* BirthDate */}
                        <Text style={labelStyle}>Date de naissance :</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={[ inputStyle, { justifyContent: "center",}, ]}
                        >
                            <Text style={{ color: birthDate ? "#555" : "#888", fontWeight: "bold" }}>
                                {birthDate ? formatDate(birthDate) : "JJ/MM/AAAA"}
                            </Text>
                        </TouchableOpacity>

                        {Platform.OS === "ios" ? (
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={showDatePicker}
                                onRequestClose={() => setShowDatePicker(false)}
                            >
                                <View 
                                    style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3",
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: isDark ? "#555" : "#888",
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20,
                                            padding: 20,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={navigateToCountrySection}
                                            style={{ alignSelf: "flex-end", marginBottom: 10 }}
                                        >
                                            <Text style={{ color: "#F43098", fontWeight: "bold" }}>Suivant</Text>
                                        </TouchableOpacity>

                                        <DateTimePicker 
                                            value={birthDate || new Date(2000,0,1)}
                                            mode="date"
                                            display="spinner"
                                            maximumDate={new Date()}
                                            onChange={(event, selectedDate) => {
                                                if (selectedDate) setBirthDate(selectedDate);
                                            }}
                                        />
                                    </View>
                                </View>
                            </Modal>
                        ) : (
                            showDatePicker && (
                                <DateTimePicker
                                    value={birthDate || new Date(2000, 0, 1)}
                                    mode="date"
                                    display="default"
                                    maximumDate={new Date()}
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (event.type !== "dismissed" && selectedDate) {
                                            setBirthDate(selectedDate);
                                        }
                                    }}
                                />  
                            )
                        )}

                        {errors.birthDate && (
                            <Text style={{ color: "#F82834", fontSize: 12, marginBottom: 8}}>
                                {errors.birthDate} ❗
                            </Text>
                        )}

                        {/* Pays */}
                        <Text style={labelStyle}>Pays :</Text>
                        <View 
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: 18,
                            }}
                        >
                            {["Belgique", "France", "Autre"].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => setCountry(country === option ? null : option)}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 10,
                                        marginBottom: 7,
                                        borderRadius: 25,
                                        backgroundColor: 
                                            country === option ? "#F43098" : isDark ? "#E0E7FF" : "#FCF2FD",
                                    }}
                                >
                                    <Text 
                                        style={{
                                            color: country === option ? "#fff" : "#555",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.country && (
                            <Text style={{ color: "#F82834", fontSize: 12, marginBottom: 8}}>
                                {errors.country} ❗
                            </Text>
                        )}

                        {/* Genre */}
                        <Text style={labelStyle}>Genre :</Text>
                        <View 
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: 18,
                            }}
                        >
                            {["Homme", "Femme", "Non précisé"].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => setGender(gender === option ? null : option)}
                                    style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 10,
                                        marginBottom: 7,
                                        borderRadius: 25,
                                        backgroundColor: 
                                            gender === option ? "#F43098" : isDark ? "#E0E7FF" : "#FCF2FD",
                                    }}
                                >
                                    <Text 
                                        style={{
                                            color: gender === option ? "#fff" : "#555",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.gender && (
                            <Text style={{ color: "#F82834", fontSize: 12, marginBottom: 8}}>
                                {errors.gender} ❗
                            </Text>
                        )}

                        {/* Newsletter */}
                        <TouchableOpacity
                            onPress={() => setNewsltter(!newsletter)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 25,
                            }}
                        >
                            <View 
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 4,
                                    backgroundColor: newsletter ? "#F43098" : "transparent",
                                    borderWidth: 4,
                                    borderColor: "#F43098",
                                    marginRight: 10,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {newsletter && <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>✓</Text>}
                            </View>
                            <Text style={{ color: isDark ? "#fff" : "#000", fontWeight: "600"}}>
                                J'accepte que Revue Citoyennne m'envoie la Newsletter
                            </Text>
                        </TouchableOpacity>

                        {/* Message d'erreur API */}
                        {apiError && <Text style={{ color: "#F82834", textAlign: "center", marginBottom: 10 }}>{apiError}</Text>}
                        
                        {/* Bouton de validation */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={loading}
                            style={{
                                backgroundColor: "#F43098",
                                padding: 13,
                                borderRadius: 30,
                                margin: 30,
                                marginHorizontal: 65,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{loading ? "Création..." : "Créer un compte"}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}