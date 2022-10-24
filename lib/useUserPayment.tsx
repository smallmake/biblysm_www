import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from "../components/Auth"
import { fetcherAccounts } from './fetcher'
import { loadStripe } from '@stripe/stripe-js';

export const useUserPayment = () => {
  const { currentUser, token } = useContext(AuthContext)
  const [stripeCustomerCard, setStripeCustomerCard] = useState(null)
  const [stripeSetupIntent, setStripeSetupIntent] = useState(null)
  const [stripePromise, setStripePromise] = useState(null)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (token) {
      const getCustomer = async () => {
        const stripe_payment = await fetcherAccounts('get', 'user_payments/stripe_payment', token, null)
        if (stripe_payment) {
          setStripeCustomerCard(stripe_payment.card)
          //console.log(`stripe_payment: ${JSON.stringify(stripe_payment.card)}`)
        }
        setIsFinished(true)
      }
      getCustomer()
    }
    return () => { setStripeCustomerCard(null); setIsFinished(false) }
  }, [token])

  const setupStripe = useCallback(async() => {
    const sp = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`)
    setStripePromise(sp)
    const setupIntent = await fetcherAccounts('post', 'user_payments/stripe_setup_intent', token, null)
    setStripeSetupIntent(setupIntent)
  }, [stripeSetupIntent, stripePromise])

  const deleteStripe = useCallback(async() => {
    const deletedCustomer = await fetcherAccounts('delete', 'user_payments/stripe_payment', token, null)
    setStripePromise(null)
    setStripeCustomerCard(null)
    setStripeSetupIntent(null)
  }, [stripeCustomerCard, stripePromise, stripeSetupIntent])

  return { stripeCustomerCard, stripeSetupIntent, stripePromise, isFinished, setupStripe, deleteStripe }
}