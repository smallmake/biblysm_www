import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcher } from './fetcher'
import { useRecoilState, atom } from "recoil"
import { recoilPersist } from "recoil-persist"
import { searchByIdOf } from './utility'

// pagination ----------------------
// total_count: records.total_count,
// limit_value: records.limit_value,
// total_pages: records.total_pages,
// current_page: records.current_page

export type BibliosFilterParams = {
  page: number
  condition: string
  category: string
  word: string
}

const { persistAtom } = recoilPersist({
	key: "recoil-persist",
	storage: typeof window === "undefined" ? undefined : sessionStorage
})

// bibliotecaFilterParamsState は以下のようなフォーマット
//  [
//    {"id":1,"filter":{"page":1,"condition":"電","category":"","word":""}},
//    {"id":2,"filter":{"page":1,"condition":"中断","category":"","word":""}}
//  ]
const bibliotecaFilterParamsState = atom<Object>({
  key: "bibliotecaFilterParamsState",
  default: [],
  effects_UNSTABLE: [persistAtom] 
})

export const useBiblios = (bibliotecaID) => {
  const { token } = useContext(AuthContext)
  const [biblios, setBiblios ] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [categories, setCategories ] = useState(null)
  const [formats, setFormats ] = useState(null)
  const [readingBiblioIds, setReadingBiblioIds] = useState([])
  const [isFinished, setIsFinished] = useState(false)
  const [filterParams, setFilterParams] = useState<BibliosFilterParams>(null)

  const [bibliotecaFilterParams, setBibliotecaFilterParams] = useRecoilState(bibliotecaFilterParamsState)

  useEffect(() => {
    let unmounted = false;
    const getBiblois = async() => {
      const bibliotecaFilter = searchByIdOf(bibliotecaFilterParams, bibliotecaID)
      let _filterParams = {"page":1,"condition":"","category":"","word":""}
      if (bibliotecaFilter) {
        _filterParams = bibliotecaFilter.filter
        setFilterParams(_filterParams)
      }
      const params = [
        `page=${_filterParams.page ? _filterParams.page  : ''}`, 
        `filter_condition=${_filterParams.condition ? _filterParams.condition : ''}`, 
        `filter_category=${_filterParams.category ? _filterParams.category : ''}`,
        `search_word=${_filterParams.word ? _filterParams.word : ''}`
      ]
      //console.log( `bibliotecas/${bibliotecaID}/biblios?page=${currentPage}`)
      // 下記URLの最後に「&」を入れている。これがないとなぜか、最後のfilter_categoryがからの時「?」という文字を渡してしまうので、その回避策。（最後のパラメータに?がつくようだ）。
      const res = await fetcher('get', `bibliotecas/${bibliotecaID}/biblios`, token, params)
      //console.log(res)
      if (res && !unmounted) {
        setBiblios(res[0])
        setPagination(res[1])
        setReadingBiblioIds(res[2])
        // if (pagination && pagination.total_pages < filterParams.page) {
        //   //setCurrentPage(pagination.total_pages)
        // }
        setIsFinished(true)
      }
      // 追加や削除があった場合に対応で毎回取得
      const _formats = await fetcher('get', `bibliotecas/${bibliotecaID}/biblios/formats`, token, null)
      setFormats(_formats.formats)
      const _categories = await fetcher('get', `bibliotecas/${bibliotecaID}/biblios/categories`, token, null)
      setCategories(_categories.categories)
    }
    getBiblois()
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [token, isFinished])

  const setFilter = useCallback(async(filterParamsObj:BibliosFilterParams) => {
    //console.log(`bibliotecaFilterParams: ${JSON.stringify(bibliotecaFilterParams)}`)
    setFilterParams(filterParamsObj)
    const bibliotecaFilter = { id: bibliotecaID, filter: filterParamsObj }
    if (bibliotecaFilterParams) {
      let _bibliotecaFilterParams = []
      if (Array.isArray(bibliotecaFilterParams)) { // 昔の残骸（配列でない）がある場合は除外し、後の処理で初期化
        _bibliotecaFilterParams = [...bibliotecaFilterParams]
        if (_bibliotecaFilterParams.length == 0) {
          _bibliotecaFilterParams = [bibliotecaFilter]
        } else {
          const inx = bibliotecaFilterParams.findIndex( obj => obj.id === bibliotecaID )
          if (inx === -1) {
            _bibliotecaFilterParams.push(bibliotecaFilter)  // 追加
          } else {
            _bibliotecaFilterParams[inx] = bibliotecaFilter // inxで更新
          }
        }
      }
      setBibliotecaFilterParams(_bibliotecaFilterParams)
    } else { // まああり得ないが、あった場合
      setBibliotecaFilterParams([bibliotecaFilter])
    }
    setIsFinished(false)
  }, [biblios, pagination, isFinished])

  const reloadPage = useCallback(async() => {
    setIsFinished(false)
  }, [biblios, pagination, isFinished])

  const scrapeAmazonUrl = useCallback(async(url) => {
    const biblio = fetcher('post', `bibliotecas/${bibliotecaID}/scrape_amazon`, token, {url: url})
    setIsFinished(false)
    return biblio
  }, [biblios, pagination, isFinished])

  const toggleReadlogBiblio = useCallback(async(biblio_id) => {
    const readlog = fetcher('post', `biblios/${biblio_id}/readlogs/toggle_reading`, token, null)
    setIsFinished(false)
  }, [biblios, pagination, isFinished])

  return { biblios, pagination, readingBiblioIds, isFinished, categories, formats, filterParams, setFilter, reloadPage, toggleReadlogBiblio, scrapeAmazonUrl }

}