import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const UNITED_STATES = 236

export const useCountries = () => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from('countries').select('*')
      setCountries(
        data
          .map(({ id, english_short_name }) => ({
            value: id,
            label: english_short_name,
          }))
          .sort((a, b) =>
            a.value === UNITED_STATES ? -1 : b.value === UNITED_STATES ? 1 : 0
          )
      )
    }
    if (!countries.length) {
      getData()
    }
  }, [])

  const countriesByName = countries?.reduce(
    (acc, curr) => ((acc[curr.label] = curr.value), acc),
    {}
  )

  return { countries, countriesByName }
}
