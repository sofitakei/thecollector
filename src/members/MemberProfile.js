import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material'
import { Link, useLocation, useParams } from 'react-router-dom'

import { usePropertiesContext } from '../contexts/PropertiesContext'
import { groups } from './config'
import { Fragment, useState } from 'react'

const MemberProfile = () => {
  const { propertyId, fileId } = useParams()
  const { currentUser, currentProperty } = usePropertiesContext()
  const [verified, setVerified] = useState(false)
  const historic = Boolean(fileId)

  //TODO: when it's a historic form, if you're a manager, you get all the users
  //probably will be handled on the back end
  const users = fileId
    ? currentProperty.forms.find(({ id }) => fileId === `${id}`)?.users
    : [currentUser]

  const { pathname } = useLocation()
  if (!currentProperty || !users) return <div>Loading</div>
  const isComplete = users.every(user => {
    const fieldValues = groups.map(({ fields }) => {
      const emptyFields = fields.reduce(
        (acc, { name, required }) =>
          user[name] || !required ? acc : [...acc, name],
        []
      )
      return emptyFields
    })
    return fieldValues.flat().length === 0
  })

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
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  key={name}>
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
          <Stack
            justifyContent='space-between'
            direction='row'
            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
            Document
            <div
              style={{
                height: 100,
                width: 150,
                background: "url('https://placehold.co/150x100')",
              }}
            />
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                color='primary'
                disabled={historic || !isComplete}
                value='confirmInfo'
                checked={verified}
                onChange={() => {
                  setVerified(ver => !ver)
                }}
              />
            }
            label='I verify all above information is correct.'
          />

          {!historic && (
            <p>
              <Link to={`${pathname}/edit`}>Click here</Link> to edit your
              information.
            </p>
          )}

          <Link to={`/properties/${propertyId}`}>Property Dashboard</Link>

          {!historic && (
            <Button
              disabled={!isComplete || (isComplete && !verified)}
              variant='contained'>
              Submit
            </Button>
          )}
        </Stack>
      ))}
    </Stack>
  )
}

export default MemberProfile
