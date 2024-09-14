import { Stack, Typography } from '@mui/material'
import { groups } from './config'
import { Fragment } from 'react'
import Photo from '../components/Photo'

const MemberDetails = ({ user }) => {
  return (
    <Stack>
      {groups.map(({ fields }, idx) => (
        <Fragment key={idx}>
          {fields.map(({ label, name, required }) => (
            <Stack direction='row' justifyContent='space-between' key={name}>
              <Typography
                sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                {label}
              </Typography>

              {name === 'photoId' ? (
                <img alt="my driver's license" src={user?.photoId} />
              ) : (
                user?.[name] ||
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
        <Photo user={user} />
      </Stack>
    </Stack>
  )
}

export default MemberDetails
