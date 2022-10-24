import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcher } from './fetcher'

// total_count: records.total_count,
// limit_value: records.limit_value,
// total_pages: records.total_pages,
// current_page: records.current_page

export const useReadlogs = (bibliotecaID, biblioID) => {
  const { token } = useContext(AuthContext)
  const [readlogs, setReadlogs ] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [isFinished, setIsFinished] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let unmounted = false;
    const getReadlogs = async() => {
      //console.log( `bibliotecas/${biblioteca.id}/biblios?page=${currentPage}`)
      // 下記URLの最後に「&」を入れている。これがないとなぜか、最後のfilter_categoryがからの時「?」という文字を渡してしまうので、その回避策。（最後のパラメータに?がつくようだ）。
      let res = null
      if (bibliotecaID) {
        res = await fetcher('get', `bibliotecas/${bibliotecaID}/readlogs?page=${currentPage}&`, token, null)
      } else if (biblioID) {
        res = await fetcher('get', `biblios/${biblioID}/readlogs?page=${currentPage}&`, token, null)
      }
      if (res && !unmounted) {
        setReadlogs(res[0])
        setPagination(res[1])
        if (pagination && pagination.total_pages < currentPage) {
          setCurrentPage(pagination.total_pages)
        }
        setIsFinished(true)
      }
    }
    getReadlogs()
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [token, isFinished, currentPage])

  const setPage = useCallback(async(page) => {
    setIsFinished(false)
    setCurrentPage(page)
  }, [readlogs, pagination, isFinished])

  const reloadPage = useCallback(async() => {
    setIsFinished(false)
  }, [readlogs, pagination, isFinished])

  const deleteReadlog = useCallback(async(readlog_id) => {
    setIsFinished(false)
    const res = fetcher('delete', `readlogs/${readlog_id}`, token, null)
  }, [readlogs, pagination, isFinished])


  return { readlogs, pagination, isFinished, setPage, reloadPage, deleteReadlog }

}
