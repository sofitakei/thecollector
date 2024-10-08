import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Button, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { useState } from 'react'

import { useAuth } from '../contexts/AuthContext'
import { usePropertyContext } from '../contexts/PropertyContext'
import { supabase } from '../supabaseClient'
import Photo from './Photo'

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
  const { currentUser } = usePropertyContext()
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

Upload.propTypes = {
  onUploadComplete: PropTypes.func,
  savedPhotoPath: PropTypes.string,
  disabled: PropTypes.bool,
}

export default Upload
