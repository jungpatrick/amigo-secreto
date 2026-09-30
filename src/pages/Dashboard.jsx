import {
  useContext,
  useEffect,
  useState
} from 'react'

import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'
import { getErrorMessage } from '../utils/errorMessages'
import TrashIcon from '../components/TrashIcon'

function Dashboard() {

  const navigate = useNavigate()
  const { user, signOut } =
    useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [description, setDescription] =
    useState('')
  const [eventDate, setEventDate] =
    useState('')
  const [groups, setGroups] = useState([])
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    loadGroups()
  }, [])

  async function handleCreateGroup(e) {

    e.preventDefault()
    setCreateError('')

    if (!title.trim()) {
      setCreateError('Informe o nome do grupo para criar o sorteio.')
      return
    }

  const { data, error } =
    await supabase
      .from('groups')
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        event_date: eventDate || null
      })
      .select()
      .single()

    if (error) {
      setCreateError(getErrorMessage(error, 'Não foi possível criar o grupo. Tente novamente.'))
      return
    }

    const { data: profile } =
      await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { error: participantError } =
      await supabase
        .from('participants')
        .insert({
          group_id: data.id,
          name: profile?.name || '',
          email: user.email,
          phone: ''
        })

    if (participantError) {
      alert(getErrorMessage(participantError, 'O grupo foi criado, mas não foi possível adicionar você como participante.'))
      return
    }

    alert('Grupo criado com sucesso!')

    navigate(`/group/${data.id}`)

    setTitle('')
    setDescription('')
    setEventDate('')
  }

  async function handleLogout() {
    await signOut()
  }

  async function loadGroups() {

    const { data, error } =
      await supabase
        .from('groups')
        .select('*')
        .order('created_at', {
          ascending: false
        })

    if (error) {
      console.log(error)
      return
    }

    setGroups(data)
  }

  async function handleDeleteGroup(id) {

  const confirmed =
    confirm(
      'Excluir grupo?'
    )

      if (!confirmed) return

      await supabase
        .from('groups')
        .delete()
        .eq('id', id)

      loadGroups()
    }

    async function handleCloneGroup(group) {

    const { data: newGroup, error }
      = await supabase
        .from('groups')
        .insert({
          user_id: user.id,
          title: `Clone de ${group.title}`,
          description: group.description,
          event_date: null,
          draw_completed: false
        })
        .select()
        .single()

    if (error) {
      alert(getErrorMessage(error, 'Não foi possível clonar o grupo. Tente novamente.'))
      return
    }

    const { data: participants }
      = await supabase
        .from('participants')
        .select('*')
        .eq('group_id', group.id)

    const clonedParticipants =
      participants.map(p => ({
        group_id: newGroup.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        wishlist: '',
        assigned_to: null,
        secret_token: null
      }))

    await supabase
      .from('participants')
      .insert(clonedParticipants)

    navigate(`/group/${newGroup.id}`)
  }

  return (
    <main className="page">
      <div className="dashboard-top"><div><p className="eyebrow">Seus eventos</p><h1>Meus sorteios</h1><p>{user?.email}</p></div><button className="button button-secondary" onClick={handleLogout}>Sair</button></div>
      <section className="card"><h2>Criar novo grupo</h2>
      <form className="create-grid" onSubmit={handleCreateGroup}>
        <div className="field"><label htmlFor="group-title">Nome do grupo</label><input id="group-title"
          type="text"
          placeholder="Nome do grupo"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        /></div>
        <div className="field"><label htmlFor="group-description">Descrição</label><textarea id="group-description"
          placeholder="Descrição"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        /></div>
        <div className="field"><label htmlFor="event-date">Data</label><input id="event-date"
          type="date"
          value={eventDate}
          onChange={(e) =>
            setEventDate(e.target.value)
          }
        /></div>
        <button className="button" type="submit">
          Criar Grupo
        </button>

      </form>{createError && <p className="form-error form-error-inline" role="alert">{createError}</p>}</section>
      <div className="section-divider" />
      <h2>Seus grupos</h2>
      {groups.length === 0 ? <p className="empty">Você ainda não criou nenhum grupo.</p> : <section className="group-grid">{groups.map(group => (
    <article className="card group-card" key={group.id}>
      <h3
        onClick={() =>
          navigate(`/group/${group.id}`)
        }
        style={{ cursor: 'pointer' }}
      >
        {group.title}
      </h3>

      <p>{group.description || 'Sem descrição.'}</p>
      <p className="group-date">{group.event_date ? `Evento em ${group.event_date}` : 'Data ainda não definida'}</p>
      <div className="card-actions"><button className="button button-secondary button-small"
          onClick={() =>
            handleCloneGroup(group)
          }
        >
          <span className="clone-icon" aria-hidden="true">⧉</span> Clonar Grupo
        </button>

        <button className="button button-danger button-small"
          onClick={() =>
            handleDeleteGroup(group.id)
          }
        >
          <TrashIcon /> Deletar Grupo
        </button>

      </div>
    </article>
  ))}</section>}
    </main>
  )
}

export default Dashboard
