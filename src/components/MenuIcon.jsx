function MenuIcon({ name }) {
  const paths = {
    account: <><circle cx="12" cy="8" r="3.25" /><path d="M5.5 20c.7-3.25 3.08-5 6.5-5s5.8 1.75 6.5 5" /></>,
    groups: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.6-3 2.55-4.6 5.5-4.6s4.9 1.6 5.5 4.6" /><path d="M16 5.6a3 3 0 0 1 0 5.8M17 14.7c1.85.54 3 1.9 3.45 4.3" /></>,
    logout: <><path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" /><path d="M14 8l4 4-4 4M18 12H9" /></>,
    gift: <><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2.5 0-4-1-4-2.5S9.1 2.8 10.3 3.4C11.4 4 12 5.6 12 7Zm0 0c2.5 0 4-1 4-2.5s-1.1-1.7-2.3-1.1C12.6 4 12 5.6 12 7Z" /></>,
    login: <><path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14" /><path d="M10 8 6 12l4 4M6 12h9" /></>
  }

  return (
    <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export default MenuIcon
