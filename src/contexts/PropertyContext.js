import { LinearProgress } from '@mui/material'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { useData } from '../hooks/useData'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'
import { usePropertiesContext } from './PropertiesContext'

const propertyContext = createContext()

const PropertyProvider = props => {
  const [showMemberCheckboxColumn, setShowMemberCheckboxColumn] = useState()

  const [selectedMembers, setSelectedMembers] = useState([])
  const [filing, setFiling] = useState()
  const [propertyUsers, setPropertyUsers] = useState({
    owner: [],
    board_member: [],
    unassigned: [],
  })
  const { userProfile, user } = useAuth()
  const { properties } = usePropertiesContext()
  const { propertyId, userId } = useParams()
  const [allowed, setAllowed] = useState({ loaded: false })
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

  useEffect(() => {
    const getData = async () => {
      //This gets the latest created filing, which should be fine?
      const { data, error } = await supabase
        .from('property_filing')
        .select('*')
        .eq('property_id', propertyId)
        .neq('status', 'void')
        .order('created_at', { descending: true })

      setFiling(data[0])
    }
    if (!filing) {
      getData()
    }
  }, [filing, propertyId])

  const allUsersForCurrentProperty = useMemo(
    () => [
      ...propertyUsers.owner,
      ...propertyUsers.board_member,
      ...propertyUsers.unassigned,
    ],
    [propertyUsers.board_member, propertyUsers.owner, propertyUsers.unassigned]
  )
  const currentUser = allUsersForCurrentProperty.find(
    ({ user_id }) => `${user_id}` === userId
  )

  const sessionPropertyUser = allUsersForCurrentProperty.find(
    ({ user_id }) => user_id === userProfile?.id
  )

  useEffect(() => {
    const getAllowed = async () => {
      const { data } = await supabase.rpc('is_member_of', {
        _user_id: user?.id,
        _property_id: propertyId,
      })
      setAllowed({ loaded: true, allowed: data })
    }
    if (user?.id && propertyId) {
      getAllowed()
    }
  }, [user?.id, propertyId])

  const value = useMemo(
    () => ({
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
      filing,
      setFiling,
    }),
    [
      allUsersForCurrentProperty,
      currentProperty,
      currentUser,
      filing,
      loaded,
      loading,
      propertyDetails,
      propertyUsers,
      selectedMembers,
      sessionPropertyUser,
      setPropertyRefresh,
      setRefresh,
      showMemberCheckboxColumn,
    ]
  )
  return !allowed.loaded ? (
    <LinearProgress />
  ) : allowed.loaded && !allowed.allowed ? (
    <Navigate to='/' />
  ) : (
    <propertyContext.Provider {...props} value={value} />
  )
}
export default PropertyProvider

export const usePropertyContext = () => useContext(propertyContext)
