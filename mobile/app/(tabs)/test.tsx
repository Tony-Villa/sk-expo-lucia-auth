import { StyleSheet, Text ,View, Button, Image } from 'react-native'
import * as Browser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import * as SecureStore from 'expo-secure-store'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import { Ionicons } from '@expo/vector-icons'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'


type User = {
  id: string
  username: string
  avatar: string
}
type Provider = 'github' | 'discord' | 'google'

const apiUrl = process.env.EXPO_PUBLIC_API_URL
const session_token = 'session_token'

export default function Test() {
  return (
    <ParallaxScrollView 
     headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={{color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',}} />}
    >
      <ThemedView>
      <ThemedText type="title">Test</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  )
}