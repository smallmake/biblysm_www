import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcherAccounts } from './fetcher'

  // STATUS 返値の構成  ===========
  // status
  //   state: user_service_status_state,  // state:
  //   reason: user_service_status_reason,// 理由
  //   trial_rest: user_service_status_trial_rest, // 試用期間残り
  //   charge: user_service_status_charge, // 課金種別
  //   next_charge: user_service_status_next_charge // 次回課金日
  //   cancel_at: user_service_status_cancel_at // キャンセル申込み中の終了日
  
  // # state:
  // # OK = 利用中
  // # NG = 利用不可
  // # NOP = まだ開始していない (No Operation)
  // # NCR = 支払い登録がまだかもしくはクレジットカードが削除されている (No Credit Card)
  // # N/A = エラー


export const useUserServiceStatus = (serviceNameProps) => {
  const { token } = useContext(AuthContext)
  const [serviceName, setServiceName] = useState(serviceNameProps)
  const [userServiceStatus, setUserServiceStatus] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  // 未登録であればstutusは空
  useEffect(() => {
    let unmounted = false;
    if (token && serviceNameProps) {
      setServiceName(serviceNameProps)
      const getUserServiceStatus = async() => {
        const status = await fetcherAccounts('get', `user_services/status/${serviceName}`, token, null)
        if (status !== null && !unmounted) {
          setUserServiceStatus(status)
          setIsFinished(true)
        }
      }
      getUserServiceStatus()
    }
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [token, isFinished]) // isFinished はactivateUserServiceなどでの変更検知


  const activateUserService = useCallback(async() => {
    setIsFinished(false)
    const status = await fetcherAccounts('post', `user_services/status/${serviceName}`, token, null)
    setUserServiceStatus(status)
  }, [userServiceStatus, isFinished])

  const cancelUserService = useCallback(async() => {
    setIsFinished(false)
    const status = await fetcherAccounts('delete', `user_services/status/${serviceName}`, token, null)
    setUserServiceStatus(status)
  }, [userServiceStatus, isFinished])

  return { userServiceStatus, isFinished, activateUserService, cancelUserService }
}
