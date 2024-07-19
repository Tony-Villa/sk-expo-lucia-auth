import { StyleSheet, Text ,View, Button, Image } from 'react-native'
import * as Browser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import * as SecureStore from 'expo-secure-store'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import { Ionicons } from '@expo/vector-icons'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'


type User = {
  id: string
  name: string
  avatarUrl: string
}
type Provider = 'github' | 'discord' | 'google'

// const apiUrl = process.env.EXPO_PUBLIC_API_URL
const apiUrl = 'http://localhost:5173'
const session_token = 'session_token'

export default function Test() {

  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  )
  const redirectURL = Linking.createURL('login')

  const getUser = async (sessionToken: string): Promise<User | null> => {
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    })

    if (!res.ok) return null
    return await res.json()
  }

  const signIn = async (provider: Provider) => {
    const result = await Browser.openAuthSessionAsync(
      `${apiUrl}/auth/login/${provider}`,
      redirectURL,
      { preferEphemeralSession: true }
    )

    if (result.type !== 'success') return
    const url = Linking.parse(result.url)

    const sessionToken = url.queryParams?.session_token?.toString() ?? null
    if (!sessionToken) return

    const user = await getUser(sessionToken)
    await SecureStore.setItemAsync(session_token, sessionToken)
    setCurrentUser(user)
  }

  const signOut = async () => {
    const sessionToken = await SecureStore.getItemAsync(session_token)
    const res = await fetch(`${apiUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    })

    if (!res.ok) return
    await SecureStore.deleteItemAsync(session_token)
    setCurrentUser(null)
  }

  useEffect(() => {
    const setup = async () => {
      const sessionToken = await SecureStore.getItemAsync(session_token)
      let user: User | null = null

      if (sessionToken) {
        user = await getUser(sessionToken)
        if (!user) {
          await SecureStore.deleteItemAsync(session_token)
        }
      } else {
        await SecureStore.deleteItemAsync(session_token)
      }
      setCurrentUser(user)
    }
    setup()
  }, [])

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

      <View style={styles.container}>
      <Text>{redirectURL}</Text>
      <Text style={[styles.text, { fontSize: 24, fontWeight: '600' }]}>
        Expo OAuth with Lucia
      </Text>
      <View style={styles.providers}>
        {currentUser === undefined ? (
          <Text style={styles.text}>Loading...</Text>
        ) : currentUser ? (
          <View style={styles.userInfo}>
            <Image
              style={{ width: 100, height: 100, borderRadius: 50 }}
              source={{ uri: currentUser.avatarUrl }}
            />
            <Text style={[styles.text, { fontSize: 16 }]}>
              username: {currentUser.name}
            </Text>
            <Text style={styles.text}>id: {currentUser.id}</Text>
            <Button title="Sign out" onPress={signOut} />
          </View>
        ) : (
          <>
            <Button
              title="Sign in with Github"
              onPress={() => signIn('github')}
            />
            <Button
              title="Sign in with Discord"
              onPress={() => signIn('discord')}
            />
            <Button
              title="Sign in with Google"
              onPress={() => signIn('google')}
            />
          </>
        )}
      </View>
      <StatusBar style="dark" />
    </View>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  providers: {
    marginTop: 10,
    gap: 10,
    minHeight: 200,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
})