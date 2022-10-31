import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcher } from './fetcher'

export interface BiblioForm {
  uuid: string
  biblioteca_id: number
  format: string
  asin: string
  isbn: string
  category: string
  priority: number
  genre: string
  place: string
  language: string
  title: string
  subtitle: string
  author: string
  publisher: string
  description: string
  pages: number
  aspect: string
  published_at: Date
  price: string
  currentvalue: string
  label: string
  used: number
  purchased_at: Date
  read_count: number
  memo: string
  note: string
  misc: string
}

export const useBiblio = (biblioID = null, biblioObj = null) => {
  const { token } = useContext(AuthContext)
  const [biblio, setBiblio ] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let unmounted = false;
    const getBibloi = async() => {
      let res = null
      if (biblioID) {
        res = await fetcher('get', `biblios/${biblioID}`, token, null)
      } else if (biblioObj) {
        res = biblioObj
      }
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
    console.log(data)
    setIsFinished(false)
    const biblioParams = { biblio: data }
    let result = null
    if (biblioID) {
      result = await fetcher('put', `biblios/${biblioID}`, token, biblioParams) // UPDATE
    } else if (biblioObj) {
      result = await fetcher('post', `biblios/`, token, biblioParams) // CREATE
    }
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