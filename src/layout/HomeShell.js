import { useTheme } from '@emotion/react'
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined'
import { AppBar, Box, Button, CssBaseline, Stack, Toolbar } from '@mui/material'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import Footer from './Footer'

const HomeShell = ({ children }) => {
  const { session } = useAuth()
  const { zIndex } = useTheme()
  const { pathname } = useLocation()
  const showBanner = pathname === '/' && dayjs().isBefore(dayjs('2025-01-01'))
  return (
    <>
      <Stack
        direction={{ sm: 'row', xs: 'column' }}
        alignItems='center'
        sx={{ a: { textDecoration: 'none', color: 'primary.contrastText' } }}>
        <CssBaseline />
        {showBanner && (
          <Box
            zIndex={zIndex.appBar + 1}
            sx={{
              backgroundColor: 'error.dark',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              color: 'primary.contrastText',
            }}>
            Initial report due January 1, 2025
          </Box>
        )}
        <AppBar
          position='fixed'
          sx={{ top: showBanner ? '20px' : 0, width: '100%' }}>
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              color: 'primary.contrastText',
            }}>
            <RouterLink to='/'>
              <DiamondOutlinedIcon sx={{ color: 'primary.contrastText' }} />
              FileHOABOI
            </RouterLink>
            <Stack direction='row' spacing={3} alignItems='baseline'>
              <RouterLink to='/pricing'>Pricing</RouterLink>
              <RouterLink to='/faq'>FAQ</RouterLink>
              <RouterLink to='/contact-us'>Contact Us</RouterLink>
              {session?.user?.id ? (
                `Logged in as ${session?.user?.email}`
              ) : (
                <Button
                  sx={{ borderColor: 'primary.contrastText' }}
                  variant='outlined'
                  to='/login'
                  component={RouterLink}>
                  Sign In
                </Button>
              )}
            </Stack>
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
