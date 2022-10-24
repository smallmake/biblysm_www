import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcher } from './fetcher'

export const useSearchNdl = (bibliotecaID) => {
  const { token } = useContext(AuthContext)
  const [targetBibliotecaID, setTargetBibliotecaID] = useState(bibliotecaID)
  const [searchNdlWord, setSearchNdlWord] = useState("")
  const [searchedNdlBiblios, setSearchedNdlBiblios ] = useState([])
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let unmounted = false;
    const getSearchedNdlBiblios = async() => {
      const res = await fetcher('post', `bibliotecas/${targetBibliotecaID}/search_ndl`, token, 
        {
          search_word: `${searchNdlWord}`,
          count: 10
        }
      )
      if (res && !unmounted) {
        setSearchedNdlBiblios(res)
        setIsFinished(true)
      }
    }
    getSearchedNdlBiblios()
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [token, isFinished, searchNdlWord])
  
  const searchNdl = useCallback(async(searchWord) => {
    setIsFinished(false)
    setSearchNdlWord(searchWord)
  }, [searchedNdlBiblios, isFinished])


  return { searchedNdlBiblios, isFinished, searchNdl }

}