import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcher } from './fetcher'

export const SearchServiceTypes = {'search_ndl': "国会図書館検索", 'search_rakuten': "Rakuten検索"}

export const useSearchService = (bibliotecaID, searchServiceName) => {
  const { token } = useContext(AuthContext)
  const [targetBibliotecaID, setTargetBibliotecaID] = useState(bibliotecaID)
  const [targetTargetSearchService, setTargetTargetSearchService] = useState(searchServiceName)
  const [searchServiceWord, setSearchServiceWord] = useState("")
  const [searchedServiceBiblios, setSearchedServiceBiblios ] = useState([])
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    let unmounted = false;
    const getSearchedNdlBiblios = async() => {
      console.log(`post: bibliotecas/${targetBibliotecaID}/${targetTargetSearchService}`)
      const res = await fetcher('post', `bibliotecas/${targetBibliotecaID}/${targetTargetSearchService}`, token, 
        {
          search_word: `${searchServiceWord}`,
          count: 10
        }
      )
      if (res && !unmounted) {
        setSearchedServiceBiblios(res)
        setIsFinished(true)
      }
    }
    getSearchedNdlBiblios()
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [token, isFinished, searchServiceWord])
  
  const searchService = useCallback(async(searchWord) => {
    setIsFinished(false)
    setSearchServiceWord(searchWord)
  }, [searchedServiceBiblios, isFinished])


  return { searchedServiceBiblios, isFinished, searchService }

}