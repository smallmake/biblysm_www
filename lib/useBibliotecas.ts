import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcher } from './fetcher'
import { useRecoilState, atom } from "recoil"
import { recoilPersist } from "recoil-persist"
import { searchByIdOf } from './utility'

const { persistAtom } = recoilPersist({
	key: "recoil-persist",
	storage: typeof window === "undefined" ? undefined : sessionStorage
})

const currentBibliotecaIDState = atom<number>({
  key: "currentBibliotecaIDState",
  default: 1,
  effects_UNSTABLE: [persistAtom] 
})

export const useBibliotecas = () => {
  const { token } = useContext(AuthContext)
  const [bibliotecas, setBibliotecas ] = useState(null)
  const [isFinished, setIsFinished] = useState(false)
  const [currentBibliotecaID, setCurrentBibliotecaID] = useRecoilState(currentBibliotecaIDState)

  useEffect(() => {
    let unmounted = false;
    const getBibloitecas = async() => {
      const _bibliotecas = await fetcher('get', `bibliotecas`, token, null)
      if (_bibliotecas) {
        if (!currentBibliotecaID || !searchByIdOf(_bibliotecas, currentBibliotecaID)) { // searchByIdOfではそもそもこのcurrentBibliotecaID は存在しないことえを確認する
          setCurrentBibliotecaID(_bibliotecas[0].id)
        }
      }
      if (_bibliotecas && !unmounted) {
        setBibliotecas(_bibliotecas)
        setIsFinished(true)
      }
    }
    getBibloitecas()
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [token])

  return { bibliotecas, isFinished, currentBibliotecaID, setCurrentBibliotecaID }
}