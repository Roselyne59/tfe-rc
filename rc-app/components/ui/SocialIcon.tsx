import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    source: any;
    url?: string;
    label: string;
}

export default function SocialIcon({source, url, label}: Props) {
    const handlePress = () => {
        if (url) Linking.openURL(url);
    };

    return (
        <TouchableOpacity onPress={handlePress} disabled={!url} style={styles.row}>
            <View style={styles.iconWrapper}>
                <Image source={source} style={styles.icon} />
            </View>
            <View style={styles.bar}>
                <Text style={styles.label}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create ({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginBottom: 8,
    },
    iconWrapper: {
        width: 30,
        height: 30,
        backgroundColor:"#000",
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: "contain",
    },
    bar: {
        paddingHorizontal: 16,
        height: 30,
        borderRadius: 30,
        backgroundColor: "#C6D2FF",
        justifyContent: "center",
        alignItems : "center",
        minWidth: 100,
    },
    label: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
    },
});