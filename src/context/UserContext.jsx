import { useState, useEffect, createContext } from 'react'
import { getCurrentUser } from '../api/user.api'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({})

  const fetchUser = async () => {
    const data = await getCurrentUser()
    setUser(data?.user)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
