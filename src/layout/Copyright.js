import { Link, Typography } from '@mui/material'

const Copyright = props => (
  <Typography align='center' color='text.secondary' variant='body2' {...props}>
    {'Copyright © '}
    <Link color='inherit' href='https://filehoaboi.com/'>
      FileHOABOI
    </Link>{' '}
    {new Date().getFullYear()}.
  </Typography>
)
export default Copyright
