import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useCountries } from '../hooks/useCountries'
import { useData } from '../hooks/useData'
import { useStates } from '../hooks/useStates'
import { useTribes } from '../hooks/useTribes'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'

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
  const [propertiesStatus, setPropertiesStatus] = useState()
  const states = useStates()
  const getData = async () =>
    await supabase
      .from('user_properties_view')
      .select('*')
      .eq('user_id', userProfile.id)

  const getStatusData = async () =>
    await supabase.rpc('get_properties_with_status_for_user', {
      _user_id: userProfile?.id,
    })

  const { loading, loaded, setRefresh } = useData({
    name: 'properties users',
    supabaseFn: getData,
    onSuccess: data => {
      setProperties(data)
    },
  })

  const { setRefresh: setRefreshStatus } = useData({
    name: 'properties status',
    supabaseFn: getStatusData,
    onSuccess: data => {
      setPropertiesStatus(data)
    },
  })

  useEffect(() => {
    if (!userProfile?.id) {
      return
    }
    setRefreshStatus(true)
    setRefresh(true)
  }, [userProfile?.id, propertyId, setRefreshStatus, setRefresh])

  const value = useMemo(
    () => ({
      properties,
      propertiesStatus,
      showRemovePropertyColumn,
      setShowRemovePropertyColumn,
      selectedProperties,
      setSelectedProperties,
      setRefresh,
      loaded,
      loading,
      countries,
      countriesByName,
      states,
      tribes,
      tribesByName,
    }),
    [
      countries,
      countriesByName,
      loaded,
      loading,
      properties,
      propertiesStatus,
      selectedProperties,
      setRefresh,
      showRemovePropertyColumn,
      states,
      tribes,
      tribesByName,
    ]
  )
  return <propertiesContext.Provider {...props} value={value} />
}
export default PropertiesProvider

export const usePropertiesContext = () => useContext(propertiesContext)
