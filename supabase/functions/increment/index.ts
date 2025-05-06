
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

console.log("increment function started")

serve(async (req) => {
  const { x } = await req.json()
  
  // Simple increment function
  const result = x + 1
  
  return new Response(
    JSON.stringify({ result }),
    { headers: { "Content-Type": "application/json" } },
  )
})
