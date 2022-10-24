import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcher } from './fetcher'

// total_count: records.total_count,
// limit_value: records.limit_value,
// total_pages: records.total_pages,
// current_page: records.current_page

export const useBiblio = (biblioID) => {
  const { token } = useContext(AuthContext)
  const [biblio, setBiblio ] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let unmounted = false;
    const getBibloi = async() => {
      const res = await fetcher('get', `biblios/${biblioID}`, token, null)
      //console.log(res)
      if (res && !unmounted) {
        setBiblio(res)
        setIsFinished(true)
      }
    }
    getBibloi()
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [token, isFinished])


  const updateBiblio = useCallback(async(data) => {
    setIsFinished(false)
    const biblio = { biblio: data }
    const result = await fetcher('put', `biblios/${biblioID}`, token, biblio)
    // const res = await fetcher('get', `biblios/${biblioID}`, token, null)
    // if (res) {
    //   setBiblio(res)
    //   setIsFinished(true)
    // }
  }, [biblio, isFinished])

  const deleteBiblio = useCallback(async() => {
    setIsFinished(false)
    const res = await fetcher('delete', `biblios/${biblioID}`, token, null)
  }, [biblio, isFinished])

  const postCover = useCallback(async(data) => {
    setIsFinished(false)
    // これは普通のformとしてpostする（JSONではない)
    const headers = new Headers();
    if (token !== null) {
      headers.append('Authorization', `Bearer ${token}`)
    }
    const obj = {
      method: 'POST',
      headers: headers,
      body: data
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BIBLYSM_API_URL}/biblios/${biblioID}/upload_cover`, obj)
    .catch(function(error) {
      console.log(error)
    })  
    // 以下は不要
    // const res = await fetcher('get', `biblios/${biblioID}`, token, null)
    // if (res) {
    //   setBiblio(res)
    //   setIsFinished(true)
    // }
  }, [biblio, isFinished])


  return { biblio, isFinished, updateBiblio, deleteBiblio, postCover }

}