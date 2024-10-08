import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'

const Photo = ({ refresh, user, photoPath, onLoad = () => {} }) => {
  const { userProfile } = useAuth()
  const [photo, setPhoto] = useState()
  const [loading, setLoading] = useState()
  const photoUser = user || userProfile

  const location =
    photoPath?.replace('documents', '') ||
    `${userProfile?.auth_user_id}/photo/${photoUser?.user_id || photoUser?.id}`

  //TODO: save path structure for future uploads
  const getPhoto = async () => {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(`${location}?t=${Date.now()}`)
    setPhoto(data)
    onLoad({ data, error })
    setLoading(false)
  }

  useEffect(() => {
    if (userProfile?.id) {
      setLoading(true)
      getPhoto()
    }
  }, [refresh])

  return (
    <Stack alignItems='center'>
      {loading || !userProfile?.auth_user_id ? (
        <CircularProgress />
      ) : photo && photo != null ? (
        <Box component='img' width='50%' src={URL.createObjectURL(photo)} />
      ) : (
        <Typography color='error'>Missing</Typography>
      )}
    </Stack>
  )
}

export default Photo
