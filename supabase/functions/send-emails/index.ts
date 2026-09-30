import { serve } from 'https://deno.land/std/http/server.ts'

import { createClient } from 'https://esm.sh/@supabase/supabase-js'

import { Resend } from 'https://esm.sh/resend'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type'
}

const resend =
  new Resend(
    Deno.env.get('RESEND_API_KEY')
  )

const fromEmail =
  Deno.env.get('RESEND_FROM_EMAIL') ||
  'Amigo Secreto <onboarding@resend.dev>'

const appUrl =
  (Deno.env.get('APP_URL') || '')
    .replace(/\/$/, '')

serve(async (req) => {

  if (req.method === 'OPTIONS') {

    return new Response(
      null,
      {
        status: 204,
        headers: corsHeaders
      }
    )
  }

  try {

    const { groupId } =
      await req.json()

    const supabase =
      createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )

    const {
      data: participants,
      error
    } = await supabase
      .from('participants')
      .select('*')
      .eq('group_id', groupId)

    if (error) {
      throw error
    }

    for (const participant of participants) {

      if (
        !participant.email ||
        !participant.secret_token
      ) {
        continue
      }

      const requestOrigin =
        (req.headers.get('origin') || '')
          .replace(/\/$/, '')

      const revealLink =
`${appUrl || requestOrigin}/reveal/${participant.secret_token}`

      const { error: emailError } = await resend.emails.send({

        from:
          fromEmail,

        to: participant.email,

        subject:
          'Seu amigo secreto foi sorteado 🎉',

        html: `
          <h1>
            Amigo Secreto
          </h1>

          <p>
            Olá ${participant.name}!
          </p>

          <p>
            Seu amigo secreto foi sorteado 🎉
          </p>

          <p>
            Clique abaixo:
          </p>

          <a href="${revealLink}">
            Ver meu amigo secreto
          </a>
        `
      })

      if (emailError) {
        throw emailError
      }
    }

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type':
            'application/json'
        }
      }
    )

  } catch (err) {

    return new Response(
      JSON.stringify({
        error: err.message
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    )
  }
})
