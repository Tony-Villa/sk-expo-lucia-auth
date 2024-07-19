import { invalidateCurrentSession } from '$lib/server/lucia/authUtils.js'

export async function POST({request}) {
  const logout = await invalidateCurrentSession(request)

  return new Response(JSON.stringify(logout), {
    "headers": {
      "Content-Type" : "application/json"
    }
  })

}
