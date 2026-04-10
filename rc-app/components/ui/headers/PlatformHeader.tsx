import React from "react";
import { Platform } from "react-native";

import Navbar from "../Navbar/Navbar";
import TabHeaderBar from "../TabBar/TabHeaderBar.android";


interface HeaderProps {
    isDark: boolean;
    searchInputRef: React.RefObject<any>;
    onMenuPress: () => void;
    }

    const Header = (props: HeaderProps) => {
    if (Platform.OS === "ios") {
        return <Navbar {...props} />;
        } else {
            return <TabHeaderBar onMenuPress={props.onMenuPress} />;
        }
    };

export default Header;