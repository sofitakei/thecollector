import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useData } from '../hooks/useData'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'
import { setRef } from '@mui/material'

const propertiesContext = createContext()

const PropertiesProvider = props => {
  const [showRemovePropertyColumn, setShowRemovePropertyColumn] =
    useState(false)
  const [showMemberCheckboxColumn, setShowMemberCheckboxColumn] = useState()
  const [selectedProperties, setSelectedProperties] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [refresh, setRefresh] = useState()
  const [propertyUsers, setPropertyUsers] = useState({
    owner: [],
    board_member: [],
    unassigned: [],
  })
  const { userProfile } = useAuth()
  const [isManager, setManager] = useState()

  const properties = useData({
    table: 'userproperty',
    columns: `*, properties(*, propertyfilings(*))`,
    refresh,
    setRefresh,
  })

  const { propertyId, userId } = useParams()

  const currentProperty = properties?.find(
    ({ property_id }) => `${property_id}` === propertyId
  )

  useEffect(() => {
    setRefresh(true)
  }, [propertyId])

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from('userproperty')
        .select(`user_id,property_role,is_manager, profiles(*)`)
        .eq('property_id', propertyId)

      const groupedUsers = data?.reduce(
        (acc, { property_role, profiles, is_manager, user_id }) => {
          if (!acc[property_role]) {
            acc.unassigned = [
              ...acc.unassigned,
              { user_id, is_manager, property_role, ...profiles },
            ]
          } else
            acc[property_role] = [
              ...acc[property_role],
              { user_id, is_manager, property_role, ...profiles },
            ]

          return acc
        },
        { owner: [], board_member: [], unassigned: [] }
      )
      setRefresh(false)
      if (groupedUsers) {
        setPropertyUsers(groupedUsers)
      }
    }
    if (refresh && propertyId && propertyId !== 'new') {
      getData()
    }
  }, [propertyId, refresh])

  const allUsersForCurrentProperty = [
    ...propertyUsers.owner,
    ...propertyUsers.board_member,
    ...propertyUsers.unassigned,
  ]

  const currentUser = allUsersForCurrentProperty.find(
    ({ user_id }) => `${user_id}` === userId
  )

  const sessionPropertyUser = allUsersForCurrentProperty.find(
    ({ user_id }) => user_id === userProfile?.id
  )

  return (
    <propertiesContext.Provider
      {...props}
      value={{
        allUsersForCurrentProperty,
        currentUser,
        currentProperty,
        properties,
        propertyUsers,
        showMemberCheckboxColumn,
        showRemovePropertyColumn,
        sessionPropertyUser,
        setShowMemberCheckboxColumn,
        setShowRemovePropertyColumn,
        selectedProperties,
        setSelectedProperties,
        selectedMembers,
        setSelectedMembers,
        setRefresh,
      }}
    />
  )
}
export default PropertiesProvider

export const usePropertiesContext = () => useContext(propertiesContext)
