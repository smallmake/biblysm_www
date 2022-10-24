import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcherAccounts } from './fetcher'

export const useUserPaids = () => {
  const { token } = useContext(AuthContext)
  const [userPaids, setUserPaids ] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let unmounted = false;
    const getUserPaids = async() => {
      const stripe_paids = await fetcherAccounts('get', 'user_payments/stripe_paids', token, null)
      //console.log(`useUserPaids: stripe_paids: ${JSON.stringify(stripe_paids)}`)
      if (stripe_paids !== null && !unmounted) {
        setUserPaids(stripe_paids)
        setIsFinished(true)
      }
    }
    getUserPaids()
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [token])

  return { userPaids, isFinished }

}