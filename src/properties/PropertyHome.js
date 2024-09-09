import { Alert, Box, Button, Stack, Typography } from '@mui/material'

import { useAuth } from '../contexts/AuthContext'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import PropertyTable from './PropertyTable'
import { supabase } from '../supabaseClient'

const PropertyHome = () => {
  const {
    propertyUsers,
    currentProperty,
    currentUser,
    sessionPropertyUser,
    setRefresh,
  } = usePropertiesContext() || {}
  const { userProfile } = useAuth()
  const { board_member, owner, unassigned } = propertyUsers
  const isManager = sessionPropertyUser?.is_manager

  const handleManagerChange = async () => {
    const { data, error } = await supabase
      .from('userproperty')
      .update({ is_manager: !isManager })
      .eq('user_id', userProfile?.id)
      .select()
    if (!error) {
      setRefresh(true)
    } else {
      console.log('change manager status failed', { error })
    }
  }

  return (
    <Stack>
      {/* <Alert severity='info'>TODO: you have some outstanding tasks.</Alert>
      <Alert severity='warning'>
        Missing manager. Click here to add a manager.
      </Alert>
      <Alert severity='error'>
        Missing payment. Click here to make a payment.
      </Alert> */}

      <Alert severity='warning' sx={{ my: 2, width: 400 }}>
        DEV ONLY
        <br />
        <Button variant='outlined' size='small' onClick={handleManagerChange}>
          {isManager ? 'demote me' : 'promote me to manager'}
        </Button>
      </Alert>
      <Button variant='outlined'>
        {isManager ? 'SUBMIT FORM' : 'Request manager access'}
      </Button>
      <Box mb={5} mt={2}>
        <Typography component='h2' gutterBottom variant='h6'>
          Board Members
        </Typography>
        <PropertyTable users={board_member} />
        <br />
        <Typography component='h2' gutterBottom variant='h6'>
          Owners of 25% or More
        </Typography>
        <PropertyTable users={owner} />
        <br />
        <Typography component='h2' gutterBottom variant='h6'>
          Unassigned
        </Typography>
        <PropertyTable users={unassigned} />
      </Box>
    </Stack>
  )
}

export default PropertyHome
