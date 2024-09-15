import { Box, Button } from '@mui/material'
import PropTypes from 'prop-types'
import { forwardRef } from 'react'

const Form = forwardRef(
  ({ children, onSubmit, disabled, buttonLabel = 'Save' }, ref) => {
    return (
      <Box
        component='form'
        noValidate
        sx={{ mt: 3 }}
        onSubmit={onSubmit}
        ref={ref}>
        {children}

        <Button
          disabled={disabled}
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          type='submit'
          variant='contained'>
          {buttonLabel}
        </Button>
      </Box>
    )
  }
)

Form.propTypes = {
  buttonLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
}

export default Form
