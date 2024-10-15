import { Alert } from '@mui/material'
import PropTypes from 'prop-types'

const Route404 = () => (
  <Alert severity='error'>
    The page you're looking for doesn't seem to exist.
  </Alert>
)

Route404.propTypes = {
  setVerified: PropTypes.func.isRequired,
}

export default Route404
