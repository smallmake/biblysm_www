import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcherAccounts } from './fetcher'

export type UserStatus = {
  id: number
  uid: string
  uname: string
  fullname: string
  email: string
  role: number
}

export const useUserStatus = () => {
  const { currentUser, token, isAuthFinished } = useContext(AuthContext)
  const [userStatus, setUserStatus] = useState<UserStatus|null>(null)
  const [isFinished, setIsFinished] = useState(false)

  useEffect( () => {
    let unmounted = false;
    if (token && isAuthFinished && currentUser) {
      const fetchUserStatus = async() => {
        const status = await fetcherAccounts('get', "users/status", token, null)
        if (status) {
          //console.log(JSON.stringify(status))
          setUserStatus(status)
          setIsFinished(true)
        }
      }
      fetchUserStatus();
    }
    const cleanup = () => {
      unmounted = true
      setUserStatus(null)
      setIsFinished(false)
    };
    return cleanup;
  }, [token, currentUser, isAuthFinished])

  const userUpdate = useCallback(async(userParams) => {
    if (currentUser && token) {
      setIsFinished(false)
      const user = await fetcherAccounts('put', `users/status`, token, userParams)
      setUserStatus(user)
    }
  }, [userStatus, isFinished])

  const userDelete = useCallback(async() => {
    if (currentUser && token) {
      setIsFinished(false)
      const user = await fetcherAccounts('delete', `users/status`, token, null)
      setUserStatus(user)
    }
  }, [userStatus, isFinished])

  return { userStatus, isFinished, userUpdate }
}