export async function GET() {
  return new Response(JSON.stringify({hi: 'hello'}), {
    "headers": {
      "Content-Type" : "application/json"
    }
  })

}