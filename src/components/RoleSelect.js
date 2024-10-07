import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { stakeholders } from '../properties/config'

const RoleSelect = props => {
  return (
    <FormControl>
      <FormLabel id='role-radio-buttons-group-label'>Role*</FormLabel>
      <RadioGroup
        row
        aria-labelledby='role-radio-buttons-group-label'
        name='property_role'
        required
        {...props}>
        {stakeholders.map(({ name, label }) => (
          <FormControlLabel
            control={<Radio />}
            key={name}
            value={name}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default RoleSelect
