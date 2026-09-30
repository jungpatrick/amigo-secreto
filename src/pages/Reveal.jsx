import {
  useEffect,
  useState
} from 'react'

import {
  useParams
} from 'react-router-dom'

import { supabase } from '../services/supabase'
import { getErrorMessage } from '../utils/errorMessages'

function Reveal() {

  const { token } = useParams()

  const [participant, setParticipant] =
    useState(null)

  const [friend, setFriend] =
    useState(null)

  const [wishlist, setWishlist] =
    useState('')

  useEffect(() => {
    loadReveal()
  }, [token])

  async function loadReveal() {

  const { data, error } =
    await supabase.rpc(
      'get_secret_reveal',
      {
        p_token: token
      }
    )

  console.log('TOKEN:', token)
  console.log('RPC DATA:', data)
  console.log('RPC ERROR:', error)

  if (error) {
    alert(
      `Erro RPC: ${error.message}`
    )
    return
  }

  if (!data) {
    alert('A RPC não retornou dados.')
    return
  }

  if (data.error) {
    alert(data.error)
    return
  }

  setParticipant({
    id: data.participant_id,
    name: data.participant_name
  })

  setFriend({
    name: data.friend_name,
    wishlist: data.friend_wishlist
  })

  
  setWishlist('')
}

  async function handleSaveWishlist() {

  const { data, error } =
    await supabase.rpc(
      'save_secret_wishlist',
      {
        p_token: token,
        p_wishlist: wishlist
      }
    )

  if (error) {
    console.error('Erro ao salvar wishlist:', error)

    alert(
      'Não foi possível salvar. Tente novamente mais tarde.'
    )

    return
  }

  if (data?.error) {
    alert(data.error)
    return
  }

  alert('Dicas salvas!')
}

  return (
    <main className="page reveal-page">

      <p className="eyebrow">
        O resultado chegou
      </p>

      <h1>
        Amigo Secreto
      </h1>

      <section className="card">

        <h2>
          Olá, {participant?.name}
        </h2>

        <div className="reveal-result">

          <p>
            Você tirou:
          </p>

          <h1>
            🎉 {friend?.name}
          </h1>

        </div>

        <h2>
          Dicas do seu amigo secreto
        </h2>

        <p className="wishlist-text">
          {friend?.wishlist ||
            'Nenhuma dica cadastrada ainda'}
        </p>

        <div className="section-divider" />

        <h2>
          Minhas dicas de presentes
        </h2>

        <textarea
          rows="6"
          maxLength="300"
          placeholder={`Digite suas dicas...
Ex:
- livros
- vale presente
`}
          value={wishlist}
          onChange={(e) =>
            setWishlist(e.target.value)
          }
        />

        <p className="counter">
          {wishlist.length} / 300 caracteres
        </p>

        <button
          className="button button-wide"
          onClick={handleSaveWishlist}
        >
          Salvar dicas
        </button>

      </section>

    </main>
  )
}

export default Reveal