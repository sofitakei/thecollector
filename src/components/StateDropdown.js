import { Autocomplete, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import { usePropertiesContext } from '../contexts/PropertiesContext'
//TODO: the autocomplete should return the id as the value
const StateDropdown = ({ name, defaultValue, onSetValue }) => {
  const { states } = usePropertiesContext()
  const [value, setValue] = useState(null)
  const handleChange = (_, v) => {
    setValue(v)
    onSetValue?.(v)
  }
  useEffect(() => {
    setValue({
      id: defaultValue,
      label: states.find(({ id }) => id === defaultValue)?.label,
    })
  }, [defaultValue, states])

  return (
    <Autocomplete
      value={value}
      disablePortal
      options={states}
      sx={{ width: '100%', mb: 2 }}
      onChange={handleChange}
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(option, value) => option.id === value}
      renderInput={params => (
        <TextField {...params} name={name} label='State' />
      )}
      getOptionKey={option => option.value}
    />
  )
}
StateDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.number.isRequired,
  onSetValue: PropTypes.func,
}
export default StateDropdown
