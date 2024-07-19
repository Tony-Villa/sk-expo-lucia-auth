import { validateAndGetSession } from '$lib/server/lucia/authUtils.js'

export async function GET({request}) { 
  const { user } = await validateAndGetSession(request)

  return new Response(JSON.stringify(user), {
    "headers": {
      "Content-Type" : "application/json"
    }
  })

}
