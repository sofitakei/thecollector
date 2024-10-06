import { Button, Fab, IconButton, Tooltip } from '@mui/material'

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
        onClick={handleClick}></ButtonComponent>
    </Tooltip>
  )
}

const IconButtonWithTooltip = ({ sxProps, ...rest }) => {
  return (
    <ButtonWithTooltip
      ButtonComponent={IconButton}
      sxProps={{ backgroundColor: 'none', ...sxProps }}
      {...rest}
    />
  )
}

const FabButtonWithTooltip = ({ sxProps, ...rest }) => {
  return (
    <ButtonWithTooltip
      ButtonComponent={Fab}
      sxProps={{ position: 'fixed', bottom: 16, right: 0, ...sxProps }}
      {...rest}
    />
  )
}

export { IconButtonWithTooltip, FabButtonWithTooltip }
export default ButtonWithTooltip
