import { StyleSheet, Text ,View, Image, ScrollView } from 'react-native'
import {Button} from '@/components'
import * as Browser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import * as SecureStore from 'expo-secure-store'

import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useContext, useEffect } from 'react'
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
  // console.log(user)

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
    <ScrollView 
      style={{backgroundColor: '#fff', marginTop: 50}}
    >
      <ThemedView style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100}}>
      <ThemedText type="title">Login</ThemedText>

      <View style={styles.container}>
      {/* <Text>{redirectURL}</Text> */}
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
            <Button  onPress={signOut}>
              <ThemedText type='defaultSemiBold'>
                Sign out
              </ThemedText>
            </Button>
          </View>
        ) : (
          <View
          style={{marginTop: 50, paddingHorizontal: 30, gap: 20}}
          >
            <Button onPress={() => signIn('github')}>
              <ThemedText type='defaultSemiBold'>
              Sign in with Github (not set up)
              </ThemedText>
            </Button>
            <Button 
            onPress={() => signIn('discord')}>
              <ThemedText type='defaultSemiBold'>
              Sign in with Discord
              </ThemedText>
            </Button>
            <Button onPress={() => signIn('google')}>
              <ThemedText type='defaultSemiBold'>
              Sign in with Google (not set up)
              </ThemedText>
            </Button>
          </View>
        )}
      </View>
      <StatusBar style="dark" />
    </View>
      </ThemedView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  providers: {
    marginTop: 10,
    gap: 10,
    minHeight: 200,
    justifyContent: 'center',
  },
  text: {
    color: '#212121',
  },
})