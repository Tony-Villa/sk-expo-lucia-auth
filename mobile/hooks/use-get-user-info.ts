import { useEffect, useState } from "react"
import * as SecureStore from 'expo-secure-store'
import { getUser } from "@/helpers/get-user"

const apiUrl = process.env.EXPO_PUBLIC_API_URL
const session_token = 'session_token'

type User = {
  id: string
  name: string
  avatarUrl: string
}

// export function useGetUserInfo() {
//   const [user, setUser] = useState<User | null | undefined>(
//     undefined
//   )


//   useEffect(() => {
//     const setup = async () => {
//       const sessionToken = await SecureStore.getItemAsync(session_token)
//       let user: User | null = null

//       if (sessionToken) {
//         user = await getUser(sessionToken)
//         if (!user) {
//           await SecureStore.deleteItemAsync(session_token)
//         }
//       } else {
//         await SecureStore.deleteItemAsync(session_token)
//       }
//       setUser(user)
//     }
//     setup()
//   }, [])

//   return {user, setUser}
// }