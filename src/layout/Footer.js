import { Box, Divider, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Copyright from './Copyright'

const Footer = () => (
  <Box mt={3}>
    <Divider />
    <Stack
      mt={4}
      justifyContent='center'
      alignItems='center'
      spacing={4}
      divider={<Divider orientation='vertical' flexItem />}
      sx={{ a: { color: 'text.primary' } }}
      direction='row'>
      <RouterLink to='/terms'>Terms and Conditions</RouterLink>
      <RouterLink to='/faq'>FAQ</RouterLink>
      <RouterLink to='/contact-us'>Contact Us</RouterLink>
    </Stack>
    <Copyright sx={{ mt: 8, mb: 4 }} />
  </Box>
)

export default Footer
