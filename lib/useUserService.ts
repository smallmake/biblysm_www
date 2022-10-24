import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcherAccounts } from './fetcher'

// service
//    service_name
//    title
//    description
//    logo_image
//    banner_image
//    site_url

export const useUserService = (serviceName) => {
  const { token } = useContext(AuthContext)
  const [service, setService ] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let unmounted = false;
    const getService = async() => {
      const s = await fetcherAccounts('get', `services/status/${serviceName}`, token, null)
      if (s && !unmounted) {
        setService(s)
        setIsFinished(true)
      }
    }
    getService()
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [token])

  return { service, isFinished }

}