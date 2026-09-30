import { useContext, useState } from 'react'

import { AuthContext } from '../contexts/AuthContext'
import { getErrorMessage } from '../utils/errorMessages'

function Account() {
  const { user, updateEmail, updatePassword } = useContext(AuthContext)
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setErrorMessage('')

    const hasNewEmail = email.trim() && email.trim() !== user?.email
    const hasNewPassword = password.length > 0

    if (!hasNewEmail && !hasNewPassword) {
      setErrorMessage('Informe um novo e-mail ou uma nova senha para salvar.')
      return
    }

    if (hasNewPassword && password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (hasNewPassword && password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.')
      return
    }

    setIsSaving(true)

    if (hasNewEmail) {
      const { error } = await updateEmail(email.trim())
      if (error) {
        setIsSaving(false)
        setErrorMessage(getErrorMessage(error, 'Não foi possível atualizar o e-mail. Tente novamente.'))
        return
      }
    }

    if (hasNewPassword) {
      const { error } = await updatePassword(password)
      if (error) {
        setIsSaving(false)
        setErrorMessage(getErrorMessage(error, 'Não foi possível atualizar a senha. Tente novamente.'))
        return
      }
    }

    setPassword('')
    setConfirmPassword('')
    setIsSaving(false)
    setMessage(hasNewEmail
      ? 'Alterações salvas. Confirme o novo e-mail pela mensagem enviada para você.'
      : 'Senha atualizada com sucesso.')
  }

  return (
    <main className="page narrow-page">
      <section className="card form-card">
        <p className="eyebrow">Sua conta</p>
        <h1>Minha Conta</h1>
        <p>Atualize seu e-mail e sua senha de acesso.</p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="account-email">E-mail</label>
            <input id="account-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="account-password">Nova senha</label>
            <input id="account-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="account-confirm-password">Confirmar nova senha</label>
            <input id="account-confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </div>
          {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
          {message && <p className="form-success" role="status">{message}</p>}
          <button className="button button-wide" type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Account
