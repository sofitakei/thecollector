import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export const useData = ({ table, columns, filter, refresh, setRefresh }) => {
  const [data, setData] = useState()
  const { userProfile } = useAuth()

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from(table)
        .select(columns)
        .eq('user_id', userProfile?.id)
      setData(data)
    }
    if (!userProfile?.id) {
      return
    }
    if (!data || refresh) {
      getData()
      setRefresh(false)
    }
  }, [refresh, userProfile?.id])

  return data
}
