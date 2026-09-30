import { createContext, useEffect, useState } from 'react'

import { supabase } from '../services/supabase'

export const AuthContext = createContext({})

function AuthProvider({ children }) {

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function getUser() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    setUser(user)

    setLoading(false)
  }

  async function signUp(name, email, password) {

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      return { error }
    }

  const { error: profileError } =
    await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name,
        email
      })

if (profileError) {
  return { error: profileError }
}

    return { data }
  }

  async function signIn(email, password) {

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      })

    return { data, error }
  }

  async function resetPassword(email) {

    const { data, error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            `${window.location.origin}/redefinir-senha`
        }
      )

    return { data, error }
  }

  async function updatePassword(password) {
    const { data, error } = await supabase.auth.updateUser({ password })

    return { data, error }
  }

  async function updateEmail(email) {
    const { data, error } = await supabase.auth.updateUser({ email })

    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        resetPassword,
        updatePassword,
        updateEmail,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
