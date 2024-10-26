import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import { AppBar, Box, CssBaseline, Stack, Toolbar } from '@mui/material'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import Footer from './Footer'

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
          my={3}
          mx='auto'
          sx={{
            pt: { xs: 12, sm: 10 },
            px: 2,
            width: {
              xs: '100vw',
              md: '80vw',
              lg: '60vw',
            },
          }}>
          {children}
        </Box>
      </Stack>
      <Footer />
    </>
  )
}

HomeShell.propTypes = {
  children: PropTypes.node.isRequired,
}

export default HomeShell
