import { Text } from "react-native";

export default function SectionTitle({ title}: { title: string}) {
    return (
        <Text className="text-white text-xl font-bold mb-2 mt-6">{title}</Text>
    )
}