import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useData } from '../hooks/useData'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'
import { usePropertiesContext } from './PropertiesContext'

const propertyContext = createContext()

const PropertyProvider = props => {
  const [showMemberCheckboxColumn, setShowMemberCheckboxColumn] = useState()

  const [selectedMembers, setSelectedMembers] = useState([])

  const [propertyUsers, setPropertyUsers] = useState({
    owner: [],
    board_member: [],
    unassigned: [],
  })
  const { userProfile } = useAuth()
  const { properties } = usePropertiesContext()
  const { propertyId, userId } = useParams()

  const currentProperty = properties?.find(
    ({ property_id }) => `${property_id}` === propertyId
  )

  const onSuccess = data => {
    const groupedUsers = data?.reduce(
      (
        acc,
        { id, property_role, is_manager, user_id, userproperty_filing, ...rest }
      ) => {
        if (!acc[property_role]) {
          acc.unassigned = [
            ...acc.unassigned,
            {
              user_id,
              is_manager,
              property_role,
              userproperty_id: id,
              userproperty_filing,
              ...rest,
            },
          ]
        } else
          acc[property_role] = [
            ...acc[property_role],
            {
              user_id,
              is_manager,
              property_role,
              userproperty_id: id,
              userproperty_filing,
              ...rest,
            },
          ]

        return acc
      },
      { owner: [], board_member: [], unassigned: [] }
    )
    setPropertyUsers(groupedUsers)
  }

  const getPropertyData = async () =>
    await supabase.from('properties').select('*').eq('id', propertyId)

  const getData = async () =>
    await supabase
      .from('users_for_property')
      .select('*')
      .eq('property_id', propertyId)

  const { data: propertyDetails, setRefresh: setPropertyRefresh } = useData({
    supabaseFn: getPropertyData,
  })
  const { loading, loaded, setRefresh } = useData({
    supabaseFn: getData,
    onSuccess,
  })

  useEffect(() => {
    if (!userProfile?.id || !propertyId) {
      return
    }
    setPropertyRefresh(true)
    setRefresh(true)
  }, [propertyId, setPropertyRefresh, setRefresh, userProfile?.id])

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
    <propertyContext.Provider
      {...props}
      value={{
        allUsersForCurrentProperty,
        currentUser,
        currentProperty: { ...currentProperty, ...propertyDetails?.[0] },
        propertyUsers,
        showMemberCheckboxColumn,
        sessionPropertyUser,
        setShowMemberCheckboxColumn,
        selectedMembers,
        setSelectedMembers,
        setPropertyRefresh,
        setRefresh,
        loading,
        loaded,
      }}
    />
  )
}
export default PropertyProvider

export const usePropertyContext = () => useContext(propertyContext)
