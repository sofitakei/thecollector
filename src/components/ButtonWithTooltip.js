import { Button, Fab, IconButton, Tooltip } from '@mui/material'
import PropTypes from 'prop-types'

const ButtonWithTooltip = ({
  disabled,
  message,
  onClick,
  sxProps,
  ButtonComponent = Button,
  ...rest
}) => {
  const handleClick = e => {
    if (!disabled) {
      onClick(e)
    }
  }
  //TODO: pull colors from theme
  const disabledProps = disabled
    ? {
        color: 'rgba(0, 0, 0, 0.26)',
        backgroundColor: '#ccc',
        boxShadow: 'none',
      }
    : {}
  return (
    <Tooltip title={message}>
      <ButtonComponent
        sx={{
          ...disabledProps,
          ...sxProps,
        }}
        {...rest}
        onClick={handleClick}
      />
    </Tooltip>
  )
}
ButtonWithTooltip.propTypes = {
  disabled: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  sxProps: PropTypes.object,
  ButtonComponent: PropTypes.object,
}

const IconButtonWithTooltip = ({ sxProps, ...rest }) => (
  <ButtonWithTooltip
    ButtonComponent={IconButton}
    sxProps={{ backgroundColor: 'none', ...sxProps }}
    {...rest}
  />
)

IconButtonWithTooltip.propTypes = {
  sxProps: PropTypes.object,
}

const FabButtonWithTooltip = ({ sxProps, ...rest }) => (
  <ButtonWithTooltip
    ButtonComponent={Fab}
    sxProps={{ position: 'fixed', bottom: 16, right: 0, ...sxProps }}
    {...rest}
  />
)

FabButtonWithTooltip.propTypes = {
  sxProps: PropTypes.object,
}

export { FabButtonWithTooltip, IconButtonWithTooltip }
export default ButtonWithTooltip
