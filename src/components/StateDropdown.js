import { Autocomplete, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import { usePropertiesContext } from '../contexts/PropertiesContext'
//TODO: the autocomplete should return the id as the value
const StateDropdown = ({ name, defaultValue, onSetValue }) => {
  const { states } = usePropertiesContext()
  const [value, setValue] = useState()
  const handleChange = (_, v) => {
    setValue(v.id)
    onSetValue?.(v.id)
  }
  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])
  //TODO: theres a duplicate key error
  return (
    <Autocomplete
      value={value}
      disablePortal
      options={states}
      sx={{ width: '100%', mb: 2 }}
      onChange={handleChange}
      renderInput={params => (
        <TextField {...params} name={name} label='State' />
      )}
    />
  )
}
StateDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  onSetValue: PropTypes.func,
}
export default StateDropdown
