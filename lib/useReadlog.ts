import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcher } from './fetcher'

// total_count: records.total_count,
// limit_value: records.limit_value,
// total_pages: records.total_pages,
// current_page: records.current_page

export const useReadlog = (readlogID) => {
  const { token } = useContext(AuthContext)
  const [readlog, setReadlog ] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let unmounted = false;
    const getReadlog = async() => {
      const res = await fetcher('get', `readlogs/${readlogID}`, token, null)
      if (res && !unmounted) {
        setReadlog(res)
        setIsFinished(true)
      }
    }
    getReadlog()
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [token, isFinished])


  const updateReadlog = useCallback(async(data) => {
    setIsFinished(false)
    const readlogData = { readlog: data }
    const result = await fetcher('put', `readlogs/${readlogID}`, token, readlogData)
  }, [readlog, isFinished])


  return { readlog, isFinished, updateReadlog }

}