import { Box, CircularProgress, Stack } from '@mui/material'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'

const Photo = ({ refresh, user }) => {
  const { userProfile } = useAuth()
  const [photo, setPhoto] = useState()
  const [loading, setLoading] = useState()
  const photoUser = user || userProfile
  const getPhoto = async () => {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(`${photoUser?.auth_user_id}/photo?t=${new Date()}`)
    setPhoto(data)
    setLoading(false)
  }

  useEffect(() => {
    if (userProfile?.id) {
      getPhoto()
    }
  }, [refresh])

  return (
    <Stack alignItems='center'>
      {loading ? (
        <CircularProgress />
      ) : photo && photo != null ? (
        <Box component='img' width='50%' src={URL.createObjectURL(photo)} />
      ) : (
        <div
          style={{
            height: 100,
            width: 150,
            background: "url('https://placehold.co/150x100')",
          }}
        />
      )}
    </Stack>
  )
}

export default Photo
