import { Backdrop, CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'

const LoadingBackdrop = ({ open }) => (
  <Backdrop
    sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
    open={open}>
    <CircularProgress color='inherit' />
  </Backdrop>
)

LoadingBackdrop.propTypes = {
  open: PropTypes.bool.isRequired,
}
export default LoadingBackdrop
