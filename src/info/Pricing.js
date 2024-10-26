import { Stack, Typography } from '@mui/material'

const Pricing = () => (
  <>
    <Typography variant='h1'>Pricing</Typography>

    <Stack
      my={4}
      mx='auto'
      sx={{
        width: {
          xs: '100vw',
          md: '60vw',
        },
        textAlign: 'left',
      }}>
      Pricing tables here
    </Stack>
  </>
)

export default Pricing
