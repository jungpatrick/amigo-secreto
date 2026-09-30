import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { getErrorMessage } from '../utils/errorMessages'

function Login() {

  const navigate = useNavigate()
  const { signIn } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleLogin(e) {

    e.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !password) {
      setErrorMessage('Informe e-mail e senha para entrar.')
      return
    }

    const { error } = await signIn(
      email.trim(),
      password
    )

    if (error) {
      setErrorMessage(getErrorMessage(error, 'Não foi possível entrar. Tente novamente.'))
      return
    }

    navigate('/dashboard')
  }

  return (
    <main className="page narrow-page">
      <section className="card form-card">
      <p className="eyebrow">Que bom te ver</p><h1>Entrar</h1>
      <form className="form-stack" onSubmit={handleLogin}>
        <div className="field"><label htmlFor="login-email">E-mail</label><input id="login-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /></div>
        <div className="field"><label htmlFor="login-password">Senha</label><input id="login-password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /></div>
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        <button className="button button-wide" type="submit">
          Entrar
        </button>
      </form>
      <p className="form-footer"><Link to="/recuperar-senha">Esqueci minha senha</Link></p>
      </section>
    </main>
  )
}

export default Login
