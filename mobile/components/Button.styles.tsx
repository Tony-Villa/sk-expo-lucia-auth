import { StyleSheet } from "react-native";

export type ButtonState = {
    pressed: boolean;
    busy?: boolean;
    disabled?: boolean;
};

export type Size = keyof typeof sizes;

export type StyleCallback<T> = (state: ButtonState & { size?: Size }) => T;

export const {container} = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    }
})

export const sizes = StyleSheet.create({
    medium: {
        paddingVertical: 16,
        paddingHorizontal: 30,
    },
    small: {
        paddingVertical: 8,
        paddingHorizontal: 20,
    }
})

export const variants = {
    primary: {
        default: {
          backgroundColor: '#bb1b',
          minWidth: '100%',
        },
        pressed: {
          backgroundColor: '#bbb',
        },
      },
    
      secondary: {
        default: {
          backgroundColor: '#fff',
          borderColor: '#bb1b',
          borderWidth: 2,
          minWidth: '100%',
        },
        pressed: {
          backgroundColor: '#bbb',
        },
      },
}