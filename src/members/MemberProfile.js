import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import PropertyDashboardButton from '../components/PropertyDashboardButton'
import { usePropertyContext } from '../contexts/PropertyContext'
import { supabase } from '../supabaseClient'
import { groups } from './config'
import MemberDetails from './MemberDetails'

const MemberProfile = () => {
  const { propertyId, fileId } = useParams()
  const { currentUser, currentProperty, setRefresh } = usePropertyContext()
  const [verified, setVerified] = useState(false)
  const historic = Boolean(fileId)
  const navigate = useNavigate()
  const [photoUploaded, setPhotoUploaded] = useState()
  const alreadyVerified = currentUser?.userproperty_filing?.some(
    ({ status }) => status === 'verified'
  )

  const handleClick = async () => {
    const {
      userproperty_id,
      property_id,
      auth_user_id,
      updated_at,
      is_manager,
      userproperty_filing,
      ...rest
    } = currentUser
    const { error } = await supabase
      .from('userproperty_filing')
      .insert({ userproperty_id, status: 'verified', filingdata: rest })
    //TODO: invalidate the current property filing
    if (!error) {
      setRefresh(true)
      const { data, error } = await supabase.functions.invoke('resend', {
        body: { email: 'admin@filehoaboi.com' },
      })
      navigate(`/properties/${propertyId}`)
    } else {
      console.log('error verifying', { error })
    }
  }

  const { pathname } = useLocation()
  if (!currentProperty || !currentUser) return <div>Loading</div>
  const isComplete =
    groups
      .map(({ fields }) => {
        const emptyFields = fields.reduce(
          (acc, { name, required }) =>
            currentUser[name] || !required ? acc : [...acc, name],
          []
        )
        return emptyFields
      })
      .flat().length === 0 && photoUploaded?.data != null

  return (
    <Stack>
      <Typography variant='h4'>
        Here is your current information for {currentProperty.name}
      </Typography>
      <br />

      <MemberDetails user={currentUser} setPhotoUploaded={setPhotoUploaded} />

      <FormControlLabel
        control={
          <Checkbox
            color='primary'
            disabled={historic || !isComplete || alreadyVerified}
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

      <PropertyDashboardButton />

      {!historic && (
        <Button
          onClick={handleClick}
          disabled={!isComplete || (isComplete && !verified)}
          variant='contained'>
          Submit
        </Button>
      )}
    </Stack>
  )
}

export default MemberProfile
