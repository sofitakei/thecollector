import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Button, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

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
  const [refresh, setRefresh] = useState(false)
  const { currentUser } = usePropertyContext()

  const handleUpload = async event => {
    const idFile = event.target.files[0]
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(
        `${userProfile?.auth_user_id}/photo/${currentUser?.user_id}`,
        idFile,
        {
          upsert: true,
        }
      )
    if (!error) {
      onUploadComplete(data)
      setRefresh(true)
    } else {
      setRefresh(false)
      console.log('There was an error uploading your photo', { error })
    }
  }

  useEffect(() => {
    setRefresh(true)
  }, [])

  return (
    <Stack alignItems='center'>
      <Photo
        onLoad={() => setRefresh(false)}
        refresh={refresh}
        user={currentUser}
        photoPath={savedPhotoPath}
      />
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
          accept='image/*'
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
