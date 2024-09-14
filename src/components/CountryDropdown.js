import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { usePropertiesContext } from '../contexts/PropertiesContext'

//TODO: the autocomplete should return the id as the value
const CountryDropdown = ({ name, defaultValue }) => {
  const { countries } = usePropertiesContext()
  //TODO: theres a duplicate key error
  return (
    <>
      <Autocomplete
        defaultValue={defaultValue}
        disablePortal
        options={countries}
        sx={{ width: '100%', mb: 2 }}
        renderInput={params => (
          <>
            <TextField {...params} name={name} label='Country/Jurisdiction' />
          </>
        )}
      />
    </>
  )
}

export default CountryDropdown
