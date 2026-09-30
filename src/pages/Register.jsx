import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { getErrorMessage } from '../utils/errorMessages'

function Register() {

  const { signUp } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  async function handleRegister(e) {

    e.preventDefault()

    const { error } = await signUp(
      name,
      email,
      password
    )

    if (error) {
      alert(getErrorMessage(error, 'Não foi possível criar a conta. Tente novamente.'))
      return
    }

    alert('Conta criada com sucesso!')
  }

  return (
    <main className="page narrow-page"><section className="card form-card">
      <p className="eyebrow">Comece agora</p><h1>Crie sua conta</h1>
      <form className="form-stack" onSubmit={handleRegister}>
        <div className="field"><label htmlFor="register-name">Seu nome</label><input id="register-name"
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /></div>
        <div className="field"><label htmlFor="register-email">E-mail</label><input id="register-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /></div>
        <div className="field"><label htmlFor="register-password">Senha</label><input id="register-password"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /></div>
        <button className="button button-wide" type="submit">
          Criar conta
        </button>

      </form>
      <p className="form-footer">Já tem uma conta? <Link to="/login">Entrar</Link></p>
    </section></main>
  )
}

export default Register
