import { useTabBarVisibility } from "@/context/TabBarVisibilityContext";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

export default function AnimatedTabBarWrapped(props: BottomTabBarProps) {
    const { tabBarstyle } = useTabBarVisibility();

    return (
        <View style={[tabBarstyle, { position: 'absolute', left: 0, right: 0, bottom: 0 }]}>
            <BottomTabBar {...props} />
        </View>
    );
}