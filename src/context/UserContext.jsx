import { createContext, useEffect, useState } from 'react'
import { getCurrentUser } from '../api/user.api'

export const UserContext = createContext({
  user: null,
  setUser: () => { },
  loading: true,
})

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    ; (async () => {
      try {
        const res = await getCurrentUser() // must return { success, user }
        if (res?.success && res?.user) {
          setUser(res.user)
        } else {
          localStorage.removeItem('token')
        }
      } catch {
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}
