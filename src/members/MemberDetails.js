import { Stack, Typography } from '@mui/material'
import { groups } from './config'
import { Fragment } from 'react'
import Photo from '../components/Photo'
import { documentTypes } from '../components/DocumentTypeDropdown'
import LoadingBackdrop from '../components/LoadingBackdrop'

const MemberDetails = ({ user, setPhotoUploaded }) => {
  return user ? (
    <Stack>
      {groups.map(({ fields }, idx) => (
        <Fragment key={idx}>
          {fields.map(({ label, name, required }) => (
            <Stack direction='row' justifyContent='space-between' key={name}>
              <Typography
                sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                {label}
              </Typography>
              {/* TODO clean this up */}
              {name === 'photoId' ? (
                <Photo />
              ) : name === 'document_type' ? (
                documentTypes.find(
                  ({ value }) => `${value}` === `${user?.[name]}`
                )?.label || <Typography color='error'>Missing</Typography>
              ) : (
                (name === 'document_jurisdiction_local_tribal_id'
                  ? user?.code
                  : user?.[name]) ||
                (required ? (
                  <Typography color='error'>Missing</Typography>
                ) : (
                  '---'
                ))
              )}
            </Stack>
          ))}
        </Fragment>
      ))}
      <Stack sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
        <p> Document</p>
        <Photo user={user} onLoad={setPhotoUploaded} />
      </Stack>
    </Stack>
  ) : (
    <LoadingBackdrop />
  )
}

export default MemberDetails
