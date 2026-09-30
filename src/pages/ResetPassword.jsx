import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthContext } from '../contexts/AuthContext'

function ResetPassword() {
  const { updatePassword } = useContext(AuthContext)
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.')
      return
    }

    setIsSaving(true)
    const { error } = await updatePassword(password)
    setIsSaving(false)

    if (error) {
      setErrorMessage(
        'Não foi possível redefinir a senha. Solicite um novo link e tente novamente.'
      )
      return
    }

    navigate('/login', { state: { passwordReset: true } })
  }

  return (
    <main className="page narrow-page">
      <section className="card form-card">
        <p className="eyebrow">Nova senha</p>
        <h1>Redefinir senha</h1>
        <p>Escolha uma nova senha para acessar sua conta.</p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="new-password">Nova senha</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="confirm-password">Confirmar nova senha</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
          <button className="button button-wide" type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
        <p className="form-footer"><Link to="/login">Voltar para o login</Link></p>
      </section>
    </main>
  )
}

export default ResetPassword
