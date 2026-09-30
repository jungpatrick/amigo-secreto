import {
  useEffect,
  useState,
  useContext
} from 'react'

import {
  useParams
} from 'react-router-dom'

import {
  AuthContext
} from '../contexts/AuthContext'

import { supabase } from '../services/supabase'
import { getErrorMessage } from '../utils/errorMessages'
import TrashIcon from '../components/TrashIcon'
import EditIcon from '../components/EditIcon'

async function getFunctionErrorMessage(error, fallback) {

  try {
    const body = await error?.context?.json()

    if (body?.error) {
      return body.error
    }
  } catch {
    // A resposta pode não conter um corpo JSON.
  }

  return getErrorMessage(error, fallback)
}

function GroupDetails() {

  const { user } =
    useContext(AuthContext)

  const { id } = useParams()

  const [group, setGroup] =
    useState(null)

  const [participants, setParticipants] =
    useState([])

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [phone, setPhone] =
    useState('')

  const [title, setTitle] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [eventDate, setEventDate] =
    useState('')

  const [participantError, setParticipantError] =
    useState('')

  const [editingParticipant, setEditingParticipant] =
    useState(null)

  const [editName, setEditName] =
    useState('')

  const [editEmail, setEditEmail] =
    useState('')

  const [editPhone, setEditPhone] =
    useState('')

  const [editError, setEditError] =
    useState('')

  useEffect(() => {
    loadGroup()
    loadParticipants()
  }, [])

  async function loadGroup() {

    const { data } =
      await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single()

    setGroup(data)

    setTitle(data.title || '')
    setDescription(data.description || '')
    setEventDate(data.event_date || '')
  }

  async function loadParticipants() {

    const { data } =
      await supabase
        .from('participants')
        .select('*')
        .eq('group_id', id)

    setParticipants(data || [])
  }

  async function handleAddParticipant(e) {

    e.preventDefault()
    setParticipantError('')

    if (!name.trim() || !email.trim()) {
      setParticipantError('Informe o nome e o e-mail do participante.')
      return
    }

    const { error } =
      await supabase
        .from('participants')
        .insert({
          group_id: id,
          name: name.trim(),
          email: email.trim(),
          phone
        })

    if (error) {
      setParticipantError(getErrorMessage(error, 'Não foi possível adicionar o participante. Tente novamente.'))
      return
    }

    alert('Participante adicionado!')

    setName('')
    setEmail('')
    setPhone('')

    loadParticipants()
  }

  async function handleDraw() {

    if (participants.length < 2) {
      alert(
        'Adicione ao menos 2 participantes'
      )
      return
    }

    const confirmed =
      confirm(
        'Deseja realizar o sorteio?'
      )

    if (!confirmed) {
      return
    }

    const shuffled =
      [...participants].sort(
        () => Math.random() - 0.5
      )

    for (
      let i = 0;
      i < shuffled.length;
      i++
    ) {

      const current =
        shuffled[i]

      const next =
        shuffled[
          (i + 1) % shuffled.length
        ]

      const secretToken =
        crypto.randomUUID()

      await supabase
        .from('participants')
        .update({
          assigned_to: next.id,
          secret_token: secretToken
        })
        .eq('id', current.id)
    }

    const { error: groupError } =
      await supabase
        .from('groups')
        .update({
          draw_completed: true
        })
        .eq('id', id)

    if (groupError) {
      alert(getErrorMessage(groupError, 'Não foi possível realizar o sorteio. Tente novamente.'))
      return
    }

    alert('Sorteio realizado!')

    loadGroup()
    loadParticipants()
  }

  async function handleDeleteParticipant(id) {

    const confirmed =
      confirm('Excluir participante?')

    if (!confirmed) return

    await supabase
      .from('participants')
      .delete()
      .eq('id', id)

    loadParticipants()
  }

  function handleOpenEditParticipant(participant) {
    setEditingParticipant(participant)
    setEditName(participant.name || '')
    setEditEmail(participant.email || '')
    setEditPhone(participant.phone || '')
    setEditError('')
  }

  function handleCloseEditParticipant() {
    setEditingParticipant(null)
    setEditError('')
  }

  async function handleUpdateParticipant(event) {
    event.preventDefault()
    setEditError('')

    if (!editName.trim() || !editEmail.trim()) {
      setEditError('Informe o nome e o e-mail do participante.')
      return
    }

    const { error } = await supabase
      .from('participants')
      .update({
        name: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim()
      })
      .eq('id', editingParticipant.id)

    if (error) {
      setEditError(getErrorMessage(error, 'Não foi possível atualizar o participante. Tente novamente.'))
      return
    }

    handleCloseEditParticipant()
    loadParticipants()
  }

  function handleShareWhatsApp(participant) {

  const appUrl =
    (import.meta.env.VITE_APP_URL || window.location.origin)
      .replace(/\/$/, '')

  const message =
`*Seu amigo secreto foi sorteado!*

Veja sua amizade secreta pelo link abaixo:

${appUrl}/reveal/${participant.secret_token}`

  const phone =
    (participant.phone || '')
      .replace(/\D/g, '')

  const url =
    `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`

  window.open(url, '_blank')
}

  async function handleUpdateGroup() {

    const { error } =
      await supabase
        .from('groups')
        .update({
          title,
          description,
          event_date: eventDate
        })
        .eq('id', id)

    if (error) {
      alert(getErrorMessage(error, 'Não foi possível atualizar o grupo. Tente novamente.'))
      return
    }

    alert('Grupo atualizado!')

    loadGroup()
  }

  function handleViewSecretFriend(
    participant
  ) {

    window.open(
      `/reveal/${participant.secret_token}`,
      '_blank'
    )
  }

  async function handleSendEmails() {

  const confirmed =
    confirm(
      'Enviar resultado para todos por email?'
    )

  if (!confirmed) {
    return
  }

  const { error } = await supabase.functions.invoke(
    'send-emails',
    {
      body: {
        groupId: id
      }
    }
  )

  if (error) {
    alert(
      await getFunctionErrorMessage(
        error,
        'Não foi possível enviar os e-mails. Tente novamente.'
      )
    )
    return
  }

  alert(
    'Emails enviados com sucesso!'
  )
}

  return (
    <>
    <main className="page"><div className="details-layout"><div className="details-main">
      <section className="card"><p className="eyebrow">Detalhes do evento</p><div className="group-editor">
        <div className="field"><label htmlFor="detail-title">Nome do grupo</label><input id="detail-title"
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        /></div>
        <div className="field"><label htmlFor="detail-description">Descrição</label><textarea id="detail-description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        /></div>
        <div className="field"><label htmlFor="detail-date">Data do evento</label><input id="detail-date"
          type="date"
          value={eventDate}
          onChange={(e) =>
            setEventDate(e.target.value)
          }
        /></div>
      <button className="button" onClick={handleUpdateGroup}>
        Salvar Alterações
      </button></div></section>
      <section className="card"><h2>Adicionar participante</h2>
      <form className="participant-form" onSubmit={handleAddParticipant}>
        <div className="field"><label htmlFor="participant-name">Nome</label><input id="participant-name"
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        /></div>
        <div className="field"><label htmlFor="participant-email">E-mail</label><input id="participant-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        /></div>
        <div className="field"><label htmlFor="participant-phone">WhatsApp</label><input id="participant-phone"
          type="text"
          placeholder="WhatsApp"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        /></div>
        <button className="button" type="submit">
          Adicionar
        </button>

      </form>{participantError && <p className="form-error form-error-inline" role="alert">{participantError}</p>}</section>
      <section className="card"><h2>Participantes</h2>
      {participants.length === 0 ? <p className="empty">Adicione pelo menos duas pessoas para realizar o sorteio.</p> : <div className="participants">{participants.map(participant => (
        <article className="participant" key={participant.id}><div><span className="participant-name">{participant.name}</span><p>{participant.email || 'E-mail não informado'}</p><p>{participant.phone || 'WhatsApp não informado'}</p></div><div className="participant-actions">

          {!group?.draw_completed && (

            <button className="button button-danger button-small"
              aria-label={`Excluir ${participant.name}`}
              onClick={() =>
                handleDeleteParticipant(
                  participant.id
                )
              }
            >
              <TrashIcon />
            </button>

          )}

          <button className="button button-secondary button-small"
            aria-label={`Editar ${participant.name}`}
            onClick={() => handleOpenEditParticipant(participant)}
          >
            <EditIcon />
          </button>

          {participant.secret_token &&
            participant.phone && (
            <button className="button button-secondary button-small"
              onClick={() =>
                handleShareWhatsApp(
                  participant
                )
              }
            >
              Enviar resultado no WhatsApp
            </button>

          )}

          {participant.secret_token &&
            participant.email === user?.email && (

            <button className="button button-secondary button-small"
              onClick={() =>
                handleViewSecretFriend(
                  participant
                )
              }
            >
              🎁 Ver meu amigo secreto
            </button>

          )}

        </div></article>
      ))}</div>}</section></div>

      {group?.draw_completed === true ? (

        <aside className="card draw-card"><p className="eyebrow">Status</p><p className="draw-status">✅ Sorteio realizado</p>
          <h2 className="send-results-title">Envie o resultado para o e-mail dos participantes</h2>
          <button className="button button-wide"
            onClick={handleSendEmails}
          >
            📧 Enviar resultado para todos
          </button>
          <p className="send-results-note">Não esqueça de avisar seus amigos para verificarem a caixa de Spam também!</p>

        </aside>

      ) : (

        <aside className="card draw-card"><p className="eyebrow">Próximo passo</p><h2>Pronto para sortear?</h2><p>Depois do sorteio, cada participante receberá seu resultado de forma privada.</p><button className="button button-wide" onClick={handleDraw}>
          Fazer Sorteio
        </button></aside>

      )}

    </div></main>

    {editingParticipant && (
      <div className="modal-backdrop" role="presentation" onMouseDown={handleCloseEditParticipant}>
        <section className="card modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-participant-title" onMouseDown={(event) => event.stopPropagation()}>
          <div className="modal-header">
            <div><p className="eyebrow">Participante</p><h2 id="edit-participant-title">Editar participante</h2></div>
            <button className="modal-close" type="button" aria-label="Fechar" onClick={handleCloseEditParticipant}>×</button>
          </div>
          <form className="form-stack" onSubmit={handleUpdateParticipant}>
            <div className="field"><label htmlFor="edit-participant-name">Nome</label><input id="edit-participant-name" type="text" value={editName} onChange={(event) => setEditName(event.target.value)} /></div>
            <div className="field"><label htmlFor="edit-participant-email">E-mail</label><input id="edit-participant-email" type="email" value={editEmail} onChange={(event) => setEditEmail(event.target.value)} /></div>
            <div className="field"><label htmlFor="edit-participant-phone">WhatsApp</label><input id="edit-participant-phone" type="text" value={editPhone} onChange={(event) => setEditPhone(event.target.value)} /></div>
            {editError && <p className="form-error" role="alert">{editError}</p>}
            <div className="modal-actions"><button className="button button-secondary" type="button" onClick={handleCloseEditParticipant}>Cancelar</button><button className="button" type="submit">Salvar alterações</button></div>
          </form>
        </section>
      </div>
    )}
    </>
  )
}

export default GroupDetails
