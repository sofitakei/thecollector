import { Box, Button } from '@mui/material'
import PropTypes from 'prop-types'

const Form = ({ children, onSubmit, buttonLabel = 'Save' }) => {
  return (
    <Box component='form' noValidate sx={{ mt: 3 }} onSubmit={onSubmit}>
      {children}

      <Button fullWidth sx={{ mt: 3, mb: 2 }} type='submit' variant='contained'>
        {buttonLabel}
      </Button>
    </Box>
  )
}

Form.propTypes = {
  buttonLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
}

export default Form
