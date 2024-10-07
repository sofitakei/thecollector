import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
} from '@mui/material'
import { supabase } from '../supabaseClient'
import { styled } from '@mui/material/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import Photo from './Photo'
import { usePropertyContext } from '../contexts/PropertyContext'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const Upload = ({ onUploadComplete, savedPhotoPath, disabled }) => {
  const { userProfile } = useAuth()
  const [refresh, setRefresh] = useState()
  const { allUsersForCurrentProperty, currentUser, currentProperty } =
    usePropertyContext()
  const photoPath =
    savedPhotoPath ||
    `${userProfile?.auth_user_id}/photo/${currentUser?.user_id || Date.now()}`

  const handleUpload = async event => {
    const idFile = event.target.files[0]
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(photoPath, idFile, {
        upsert: true,
      })
    if (!error) {
      onUploadComplete(data)
      setRefresh(true)
    } else {
      console.log('There was an error uploading your photo', { error })
    }
  }

  return (
    <Stack alignItems='center'>
      <Photo refresh={refresh} user={currentUser} photoPath={photoPath} />
      <Button
        disabled={disabled}
        component='label'
        role={undefined}
        startIcon={<CloudUploadIcon />}
        tabIndex={-1}
        variant='contained'>
        Upload file
        <VisuallyHiddenInput
          onChange={handleUpload}
          disabled={disabled}
          type='file'
        />
      </Button>
    </Stack>
  )
}

export default Upload
