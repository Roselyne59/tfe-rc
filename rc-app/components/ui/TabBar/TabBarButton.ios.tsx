import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TabBarButtonProps {
    label?: string;
    icon?: React.ReactNode;
    isFocused?: boolean;
    onPress: () => void;
}

export default function TabBarButton({ label, icon, isFocused, onPress }: TabBarButtonProps) {
    return (
        <TouchableOpacity
            className={`items-center justify-center px-5 py-2 rounded-full ${
                isFocused ? 'bg-violet-600' : 'bg-violet-400'
            }`}
            onPress={onPress}
        >
            {icon && (<View className= {`${label ? 'mb-1' : ''}`}>{icon}</View>)}
            {label ? (<Text className="text-white text-xs font-bold uppercase">{label}</Text>) : null}
        </TouchableOpacity>
    );
}