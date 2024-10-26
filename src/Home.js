import { Stack, Typography } from '@mui/material'
import { Navigate } from 'react-router-dom'

import { useAuth } from './contexts/AuthContext'

const blurbs = [
  { left: 'Have some blurb here about how great the product is' },
  { left: 'And another blurb yay' },
]

const Home = () => {
  const { session } = useAuth()
  if (session?.user?.id) return <Navigate to='/properties' />

  return (
    <Stack>
      {blurbs.map(({ left }, index) => (
        <Stack
          key={index}
          my={2}
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems='left'
          sx={{ textAlign: 'left', 'div,h4': { flex: 1 } }}>
          <Typography variant='h4' width='50%'>
            {left}
          </Typography>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </Stack>
      ))}
    </Stack>
  )
}

export default Home
