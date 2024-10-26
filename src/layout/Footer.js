import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import XIcon from '@mui/icons-material/X'
import { Box, Divider, IconButton, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Copyright from './Copyright'

const Footer = () => (
  <Box mt={3}>
    <Divider />
    <Stack
      mt={2}
      justifyContent='center'
      alignItems='center'
      spacing={2}
      sx={{ a: { color: 'text.primary' } }}
      direction={{ xs: 'column', sm: 'row' }}>
      <RouterLink to='/terms'>Terms of Service</RouterLink>
      <RouterLink to='/privacy'>Privacy Policy</RouterLink>
      <RouterLink to='/contact-us'>Contact Us</RouterLink>
      <div>
        Connect with us:
        <br />
        <IconButton>
          <InstagramIcon />
        </IconButton>
        <IconButton>
          <FacebookIcon />
        </IconButton>
        <IconButton>
          <XIcon />
        </IconButton>
      </div>
    </Stack>
    <Copyright sx={{ mt: 8, mb: 4 }} />
  </Box>
)

export default Footer
