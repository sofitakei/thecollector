import { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'

export const useStates = () => {
  const [states, setStates] = useState([])

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from('states')
        .select('*')
        .order('state', 'asc')
      setStates(
        data.map(({ id, state }) => ({
          id,
          label: state,
        }))
      )
    }
    if (!states.length) {
      getData()
    }
  }, [states?.length])

  return states
}
