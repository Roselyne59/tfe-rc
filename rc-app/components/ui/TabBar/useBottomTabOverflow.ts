import { Platform } from 'react-native';

//Importe la bonne version selon l'OS
const { useBottomTabOverflow } =
    Platform.OS === 'ios'
        ? require('./AnimatedTabBarWrapped.ios')
        : require('./AnimatedTabBarWrapped.android');

export { useBottomTabOverflow };
