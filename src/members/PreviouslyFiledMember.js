import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  setRef,
  Stack,
  Typography,
} from '@mui/material'
import { Link, useParams } from 'react-router-dom'

import { Fragment, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import MemberDetails from './MemberDetails'
import { usePropertyContext } from '../contexts/PropertyContext'

const PreviouslyFiledMember = () => {
  const { propertyId, fileId } = useParams()
  const [filing, setFiling] = useState()
  const { currentProperty } = usePropertyContext() || {}

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from('property_filing')
        .select('*')
        .eq('id', fileId)
      setFiling(data[0])
    }

    getData()
  }, [])

  if (!filing) return <div>Loading</div>

  return (
    <Stack>
      <Typography variant='h4'>
        Here is your information for {currentProperty?.name} that was filed on{' '}
        {new Date(filing?.created_at).toLocaleDateString('en-US')}
      </Typography>
      <br />
      {filing.filing.map((user, idx) => (
        <>
          <MemberDetails user={user} />
          <Divider sx={{ my: 3 }}></Divider>
        </>
      ))}

      <Link to={`/properties/${propertyId}`}>Property Dashboard</Link>
    </Stack>
  )
}

export default PreviouslyFiledMember
