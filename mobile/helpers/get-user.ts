const apiUrl = process.env.EXPO_PUBLIC_API_URL

type User = {
  id: string
  name: string
  avatarUrl: string
}

export async function getUser (sessionToken: string): Promise<User | null> {
  const res = await fetch(`${apiUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  })

  if (!res.ok) return null
  return await res.json()
}