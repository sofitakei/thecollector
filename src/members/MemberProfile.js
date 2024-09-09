import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { Link, useLocation, useParams } from 'react-router-dom'

import { usePropertiesContext } from '../contexts/PropertiesContext'
import { groups } from './config'
import { Fragment } from 'react'

const MemberProfile = () => {
  const { propertyId, fileId } = useParams()
  const { currentUser, currentProperty } = usePropertiesContext()
  const historic = Boolean(fileId)

  //TODO: when it's a historic form, if you're a manager, you get all the users
  //probably will be handled on the back end
  const users = fileId
    ? currentProperty.forms.find(({ id }) => fileId === `${id}`)?.users
    : [currentUser]
  console.log({ users })
  const { pathname } = useLocation()
  if (!currentProperty || !users) return <div>Loading</div>
  return (
    <Stack>
      <Typography variant='h4'>
        {historic
          ? `Here is your information for ${
              currentProperty.properties.name
            } that was filed on ${new Date(
              users[0].filedDate
            ).toLocaleDateString('en-US')}`
          : `Here is your current information for ${currentProperty.properties.name}`}
      </Typography>
      <br />
      {users.map(user => (
        <Stack key={user?.user_id}>
          {groups.map(({ fields }, idx) => (
            <Fragment key={idx}>
              {fields.map(({ label, name }) => (
                <Stack direction='row' justifyContent='space-between'>
                  <Typography
                    sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    {label}
                  </Typography>

                  {name === 'photoId' ? (
                    <img alt="my driver's license" src={user?.photoId} />
                  ) : (
                    user?.[name] || (
                      <Typography color='error'>Missing</Typography>
                    )
                  )}
                </Stack>
              ))}
            </Fragment>
          ))}
          <Grid
            item
            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
            xs={6}>
            Document
          </Grid>
          <Grid item xs={6}>
            <div
              style={{
                height: 100,
                width: 150,
                background: "url('https://placehold.co/150x100')",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={historic}
                  color='primary'
                  disabled={historic}
                  value='confirmInfo'
                />
              }
              label='I verify all above information is correct.'
            />
          </Grid>
          <Grid item xs={6}>
            <Link to={`/properties/${propertyId}`}>Property Dashboard</Link>
          </Grid>
          {!historic && (
            <Button disabled variant='contained'>
              Submit
            </Button>
          )}
        </Stack>
      ))}
      {!historic && (
        <p>
          <Link to={`${pathname}/edit`}>Click here</Link> to edit your
          information.
        </p>
      )}
    </Stack>
  )
}

export default MemberProfile
