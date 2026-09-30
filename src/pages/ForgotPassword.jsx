import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../contexts/AuthContext'
import { getErrorMessage } from '../utils/errorMessages'

function ForgotPassword() {

  const { resetPassword } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)

  async function handleReset(e) {

    e.preventDefault()

    const { error } = await resetPassword(email)

    if (error) {
      alert(getErrorMessage(error, 'Não foi possível enviar o link. Tente novamente.'))
      return
    }

    setIsSent(true)
  }

  return (
    <main className="page narrow-page"><section className="card form-card">
      <p className="eyebrow">Acesso à conta</p><h1>Recuperar senha</h1>
      {isSent ? (
        <div className="success-panel" role="status">
          <span aria-hidden="true">✓</span>
          <p>Se este email estiver cadastrado, um link para resetar sua senha foi enviado.</p>
          <Link className="button button-wide" to="/login">Fazer login</Link>
        </div>
      ) : <>
      <p>Digite seu e-mail para receber o link de recuperação.</p>
      <form className="form-stack" onSubmit={handleReset}>
        <div className="field"><label htmlFor="reset-email">E-mail</label><input id="reset-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /></div>
        <button className="button button-wide" type="submit">
          Enviar link
        </button>

      </form>
      <p className="form-footer"><Link to="/login">Voltar para o login</Link></p>
      </>}
    </section></main>
  )
}

export default ForgotPassword
