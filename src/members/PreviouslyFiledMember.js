import { Divider, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import PropertyDashboardButton from '../components/PropertyDashboardButton'
import { usePropertyContext } from '../contexts/PropertyContext'
import { supabase } from '../supabaseClient'
import MemberDetails from './MemberDetails'

const PreviouslyFiledMember = () => {
  const { fileId } = useParams()
  const [filing, setFiling] = useState()
  const { currentProperty } = usePropertyContext() || {}

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from('property_filing')
        .select('*')
        .eq('id', fileId)
      setFiling(data[0])
    }

    getData()
  }, [fileId])

  if (!filing) return <div>Loading</div>

  return (
    <Stack>
      <Typography variant='h4'>
        Here is your information for {currentProperty?.name} that was filed on{' '}
        {new Date(filing?.created_at).toLocaleDateString('en-US')}
      </Typography>
      <br />
      {filing.filing.map(user => (
        <>
          <MemberDetails user={user} />
          <Divider sx={{ my: 3 }} />
        </>
      ))}

      <PropertyDashboardButton />
    </Stack>
  )
}

export default PreviouslyFiledMember
