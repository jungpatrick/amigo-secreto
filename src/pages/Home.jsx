import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'


  function Home() { 

    const navigate = useNavigate() 
    const { user } = useContext(AuthContext) 
    
    function handleCreateGroup() { if (user) { 
      navigate('/dashboard') 
    } else { 
      navigate('/cadastro') 
    } }

  return (

    <main>
      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow">Celebre junto</p>
          <h1>Amigo Secreto, sem complicação.</h1>

          <p>
            Organize sorteios de forma rápida,
            divertida e segura.
          </p>

          <button className="button" onClick={handleCreateGroup}>
            Criar Amigo Secreto
          </button>
        </div>
        <aside className="hero-art" aria-hidden="true"><span className="gift">🎁</span></aside>
      </section>

      <section className="how-it-works" aria-labelledby="how-it-works-title">
        <div className="container">
          <div className="how-it-works-heading">
            <p className="eyebrow">Como funciona</p>
            <h2 id="how-it-works-title">Planeje seu amigo secreto em poucos passos</h2>
          </div>

          <ol className="steps-list">
            <li className="step-item">
              <span className="step-number">1</span>
              <p>Crie sua conta</p>
            </li>
            <li className="step-item">
              <span className="step-number">2</span>
              <p>Crie o grupo</p>
            </li>
            <li className="step-item">
              <span className="step-number">3</span>
              <p>Adicione os participantes</p>
            </li>
            <li className="step-item">
              <span className="step-number">4</span>
              <p>Faça o sorteio</p>
            </li>
            <li className="step-item">
              <span className="step-number">5</span>
              <p>Compartilhe o resultado por WhatsApp ou e-mail</p>
            </li>
          </ol>

          <div className="how-it-works-note">
            <span aria-hidden="true">💡</span>
            <p>Os participantes também podem adicionar dicas de presentes.</p>
          </div>

          <p className="how-it-works-closing">Divirta-se! <span aria-hidden="true">✨</span></p>
        </div>
      </section>
    </main>
  )
}

export default Home
