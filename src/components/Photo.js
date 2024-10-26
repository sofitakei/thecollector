import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'

const Photo = ({ refresh, user, photoPath, onLoad = () => {} }) => {
  const { userProfile } = useAuth()
  const [photo, setPhoto] = useState()
  const [loading, setLoading] = useState()
  const photoUser = user || userProfile

  const location =
    photoPath?.replace('documents', '') ||
    `${userProfile?.auth_user_id}/photo/${photoUser?.user_id || photoUser?.id}`

  useEffect(() => {
    const getPhoto = async () => {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(`${location}?t=${Date.now()}`)
      setPhoto(data)
      onLoad({ data, error })
      setLoading(false)
    }
    if (userProfile?.id && !loading && refresh && photoPath) {
      setLoading(true)
      getPhoto()
    }
  }, [loading, location, onLoad, photoPath, refresh, userProfile?.id])

  return (
    <Stack alignItems='center'>
      {!photoPath ? (
        <Typography color='error'>Missing</Typography>
      ) : loading || !userProfile?.auth_user_id ? (
        <CircularProgress />
      ) : (
        photo &&
        photo != null && (
          <Box component='img' width='50%' src={URL.createObjectURL(photo)} />
        )
      )}
    </Stack>
  )
}

Photo.propTypes = {
  refresh: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  photoPath: PropTypes.string,
  onLoad: PropTypes.func,
}
export default Photo
