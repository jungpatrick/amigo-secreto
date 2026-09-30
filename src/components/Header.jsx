import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthContext } from '../contexts/AuthContext'
import MenuIcon from './MenuIcon'

function Header() {

  const { user, signOut } =
    useContext(AuthContext)

  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] =
    useState(false)

  async function handleLogout() {
    setMenuOpen(false)
    await signOut()
    navigate('/')
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container header-content">

        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          🎁 Amigo Secreto
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={menuOpen ? 'menu-open' : ''}>
          <ul>

            {!user && (
              <>
                <li>
                  <Link
                    to="/cadastro"
                    onClick={closeMenu}
                  >
                    <MenuIcon name="gift" />
                    Criar Amigo Secreto
                  </Link>
                </li>

                <li>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                  >
                    <MenuIcon name="login" />
                    Login
                  </Link>
                </li>
              </>
            )}

            {user && (
              <>
                <li>
                  <Link
                    to="/minha-conta"
                    onClick={closeMenu}
                  >
                    <MenuIcon name="account" />
                    Minha Conta
                  </Link>
                </li>

                <li>
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                  >
                    <MenuIcon name="groups" />
                    Meus sorteios
                  </Link>
                </li>

                <li>
                  <button onClick={handleLogout}>
                    <MenuIcon name="logout" />
                    Sair
                  </button>
                </li>
              </>
            )}

          </ul>
        </nav>

      </div>
    </header>
  )
}

export default Header