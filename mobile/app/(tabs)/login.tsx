import { StyleSheet, Text ,View, Button, Image } from 'react-native'
import * as Browser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import * as SecureStore from 'expo-secure-store'

import ParallaxScrollView from '@/components/ParallaxScrollView'
import { Ionicons } from '@expo/vector-icons'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useContext, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { getUser } from '@/helpers/get-user'
import { UserContext } from '@/helpers/contexts'


type User = {
  id: string
  name: string
  avatarUrl: string
}
type Provider = 'github' | 'discord' | 'google'

const apiUrl = process.env.EXPO_PUBLIC_API_URL
const session_token = 'session_token'

export default function Login() {
  const redirectURL = Linking.createURL('login')

  const {user, setUser} = useContext(UserContext)
  console.log(user)

  const signIn = async (provider: Provider) => {
    const authUrl = new URL(`${apiUrl}/auth/login/${provider}`)
    authUrl.searchParams.set('redirectUrl', redirectURL)


    const result = await Browser.openAuthSessionAsync(
      authUrl.toString(),
      redirectURL,
      { preferEphemeralSession: true }
    )

    if (result.type !== 'success') return
    const url = Linking.parse(result.url)

    const sessionToken = url.queryParams?.session_token?.toString() ?? null
    if (!sessionToken) return

    const user = await getUser(sessionToken)
    await SecureStore.setItemAsync(session_token, sessionToken)
    setUser(user)
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
    setUser(null)
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
      setUser(user)
    }
    setup()
  }, [])

  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Ionicons size={310} name="bus" style={{color: '#1D3D47',
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
        {user === undefined ? (
          <Text style={styles.text}>Loading...</Text>
        ) : user ? (
          <View style={styles.userInfo}>
            <Image
              style={{ width: 100, height: 100, borderRadius: 50 }}
              source={{ uri: user.avatarUrl }}
            />
            <Text style={[styles.text, { fontSize: 16 }]}>
              username: {user.name}
            </Text>
            <Text style={styles.text}>id: {user.id}</Text>
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