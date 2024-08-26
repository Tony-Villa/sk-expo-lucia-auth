import { Pressable, StyleSheet, ViewStyle } from 'react-native'
import * as styles from './Button.styles'

interface ButtonProps {
    children: React.ReactNode;
    variant?: keyof typeof styles.variants;
    size?: styles.Size;
    onPress?: () => void | undefined | Promise<unknown>;
    style?: ViewStyle ;
}

export function Button({
    children,
    variant = 'primary',
    size = 'medium',
    onPress,
    style,
}: ButtonProps) {
    return (
        <Pressable 
        onPress={onPress}
        style={({pressed}) => [
            styles.container,
            pressed ? styles.variants[variant].pressed : styles.variants[variant].default,
            styles.sizes[size],
            style
        ]}>
            {children}
        </Pressable>
    )
}

