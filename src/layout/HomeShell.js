import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Stack,
  Toolbar,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import Copyright from './Copyright'

const HomeShell = ({ children }) => {
  const { session } = useAuth()
  return (
    <>
      <Stack
        direction={{ sm: 'row', xs: 'column' }}
        alignItems='center'
        sx={{ a: { textDecoration: 'none', color: 'primary.contrastText' } }}>
        <CssBaseline />
        <AppBar position='fixed' sx={{ width: '100%' }}>
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              color: 'primary.contrastText',
            }}>
            <RouterLink to='/'>
              <DiamondOutlinedIcon sx={{ color: 'primary.contrastText' }} />
              FileHOABOI
            </RouterLink>
            {session?.user?.id ? (
              `Logged in as ${session?.user?.email}`
            ) : (
              <RouterLink to='/login'>Sign in</RouterLink>
            )}
          </Toolbar>
        </AppBar>

        <Box
          component='main'
          sx={{
            flexGrow: 1,
            pt: { xs: 12, sm: 10 },
            px: 2,
          }}>
          {children}
        </Box>
      </Stack>
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
    </>
  )
}

HomeShell.propTypes = {
  children: PropTypes.node.isRequired,
}

export default HomeShell
