import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'
import { useData } from '../hooks/useData'
import { useCountries } from '../hooks/useCountries'
import { useTribes } from '../hooks/useTribes'

const propertiesContext = createContext()

const PropertiesProvider = props => {
  const [showRemovePropertyColumn, setShowRemovePropertyColumn] =
    useState(false)
  const [selectedProperties, setSelectedProperties] = useState([])

  const { userProfile } = useAuth()
  const [properties, setProperties] = useState()
  const { propertyId } = useParams()
  const { countries, countriesByName } = useCountries()
  const { tribes, tribesByName } = useTribes()
  const getData = async () => {
    return await supabase
      .from('user_properties_view')
      .select('*')
      .eq('user_id', userProfile.id)
  }

  const { loading, loaded, setRefresh } = useData({
    name: 'properties users',
    supabaseFn: getData,
    onSuccess: data => {
      setProperties(data)
    },
  })

  useEffect(() => {
    if (!userProfile?.id) {
      return
    }
    setRefresh(true)
  }, [userProfile?.id, propertyId])

  return (
    <propertiesContext.Provider
      {...props}
      value={{
        properties,
        showRemovePropertyColumn,
        setShowRemovePropertyColumn,
        selectedProperties,
        setSelectedProperties,
        setRefresh,
        loaded,
        loading,
        countries,
        countriesByName,
        tribes,
        tribesByName,
      }}
    />
  )
}
export default PropertiesProvider

export const usePropertiesContext = () => useContext(propertiesContext)
