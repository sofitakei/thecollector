import { Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { Fragment, useState } from 'react'

import { documentTypes } from '../components/DocumentTypeDropdown'
import LoadingBackdrop from '../components/LoadingBackdrop'
import Photo from '../components/Photo'
import { groups } from './config'

const MemberDetails = ({ user, setPhotoUploaded }) => {
  const [refreshPhoto, setRefreshPhoto] = useState(true)
  const onLoad = ({ data }) => {
    setRefreshPhoto(false)
    setPhotoUploaded?.({ data })
  }
  return user ? (
    <Stack>
      {groups.map(({ fields }, idx) => (
        <Fragment key={idx}>
          {fields.map(({ label, name, required }) => (
            <Stack direction='row' justifyContent='space-between' key={name}>
              <Typography
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}>
                {label}
              </Typography>
              {/* TODO clean this up */}
              {name === 'state_id'
                ? user?.state
                : name === 'document_type'
                ? documentTypes.find(
                    ({ value }) => `${value}` === `${user?.[name]}`
                  )?.label || <Typography color='error'>Missing</Typography>
                : (name === 'document_jurisdiction_local_tribal_id'
                    ? user?.code
                    : user?.[name]) ||
                  (required ? (
                    <Typography color='error'>Missing</Typography>
                  ) : (
                    '---'
                  ))}
            </Stack>
          ))}
        </Fragment>
      ))}
      <Stack sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
        <p> Document</p>
        <Photo
          refresh={refreshPhoto}
          user={user}
          photoPath={user.identification_url}
          onLoad={onLoad}
        />
      </Stack>
    </Stack>
  ) : (
    <LoadingBackdrop />
  )
}

MemberDetails.propTypes = {
  user: PropTypes.object,
  setPhotoUploaded: PropTypes.func,
}

export default MemberDetails
