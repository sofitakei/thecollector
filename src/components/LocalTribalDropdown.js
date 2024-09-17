import { Autocomplete, TextField } from '@mui/material'
import { usePropertiesContext } from '../contexts/PropertiesContext'

//TODO: the autocomplete should return the id as the value
const LocalTribalDropdown = ({ name, ...rest }) => {
  const { tribes } = usePropertiesContext()

  //TODO: theres a duplicate key error
  return (
    <>
      <Autocomplete
        disablePortal
        options={tribes}
        getOptionLabel={option => option.value}
        getOptionKey={option => option.id}
        sx={{ width: '100%', mb: 2 }}
        renderInput={params => (
          <>
            <TextField {...params} name={name} label='Local/Tribal' />
          </>
        )}
        {...rest}
      />
    </>
  )
}

export default LocalTribalDropdown
