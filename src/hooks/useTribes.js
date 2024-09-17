import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export const useTribes = () => {
  const [tribes, setTribes] = useState([])

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from('local_tribal').select('*')
      setTribes(
        data.map(({ id, code }) => ({
          id,
          label: code,
          value: code,
        }))
      )
    }
    if (!tribes.length) {
      getData()
    }
  }, [])

  const tribesByName = tribes?.reduce(
    (acc, curr) => ((acc[curr.label] = curr.value), acc),
    {}
  )

  return { tribes, tribesByName }
}
