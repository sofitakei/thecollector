import { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'

export const useEmail = ({ email, emailType, emailData }) => {
  const [emailId, setEmailId] = useState()
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const sendEmail = async () => {
      setLoading(true)
      const { data, error } = await supabase.functions.invoke('resend', {
        body: { email, emailType, data: emailData },
      })
      if (error != null) {
        console.log('error with sending email', { error })
      } else {
        setEmailId(data)
      }
      setLoading(false)
      setLoaded(true)
    }

    if (!loading) {
      sendEmail()
    }
  }, [email, emailData, emailType, loading])

  return { emailId, loaded, loading }
}
