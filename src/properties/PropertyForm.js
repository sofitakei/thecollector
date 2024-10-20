import { Alert, MenuItem, TextField } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import CountryDropdown from '../components/CountryDropdown'
import Form from '../components/Form'
import LoadingBackdrop from '../components/LoadingBackdrop'
import { useAuth } from '../contexts/AuthContext'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import { usePropertyContext } from '../contexts/PropertyContext'
import { supabase } from '../supabaseClient'
import { getFormFields } from '../utils'
import { fields } from './config'

//TODO: create gate for non-admins
const PropertyForm = () => {
  const navigate = useNavigate()
  const { currentProperty, setPropertyRefresh } = usePropertyContext() || {}
  const { countries, countriesByName } = usePropertiesContext()
  const [errors, setErrors] = useState()
  const {
    userProfile: { id },
  } = useAuth()

  const { propertyId: idParam } = useParams()

  const handleSubmit = async e => {
    e.preventDefault()
    const { property_role, ...formFields } = getFormFields(e.target)
    let propertyId = currentProperty?.id
    if (!formFields.name) {
      setErrors('Company field is required')
      window.scrollTo(0, 0)
    } else if (idParam === 'new' && !property_role) {
      window.scrollTo(0, 0)
      setErrors('Property role is required')
    } else {
      //TODO: this should be done in the country dropdown component
      const country_id = countriesByName[formFields.country_jurisdiction_id]
      if (!currentProperty) {
        const { data } = await supabase.rpc('add_property_with_owner', {
          ...formFields,
          property_role,
          country_jurisdiction_id: country_id,
          created_by: id,
        })

        propertyId = data?.[0]?.id
      } else {
        await supabase
          .from('properties')
          .update({ ...formFields, country_jurisdiction_id: country_id })
          .eq('id', currentProperty.id)
      }

      setPropertyRefresh?.(true)
      if (propertyId) {
        navigate(`/properties/${propertyId}/invite`)
      }
    }
  }
  const handleFocus = () => {
    setErrors()
  }
  //TODO:checking this field to see if we loaded the details
  return currentProperty?.created_at || idParam === 'new' ? (
    <Form onSubmit={handleSubmit}>
      {errors && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {errors}
        </Alert>
      )}
      {fields.map(({ name, options, select, ...rest }) =>
        name === 'country_jurisdiction_id' ? (
          <CountryDropdown
            name={name}
            key={name}
            countries={countries}
            defaultValue={
              countries.find(
                ({ value }) =>
                  value === currentProperty?.country_jurisdiction_id
              ) || ''
            }
          />
        ) : name === 'property_role' && idParam !== 'new' ? null : (
          <TextField
            style={{ marginBottom: 20 }}
            fullWidth
            name={name}
            key={name}
            select={select}
            {...rest}
            onFocus={handleFocus}
            defaultValue={currentProperty?.[name] || ''}>
            {select &&
              options?.length &&
              options.map(({ name, label, id, value }) => (
                <MenuItem key={id} value={value || id}>
                  {name || label}
                </MenuItem>
              ))}
          </TextField>
        )
      )}
    </Form>
  ) : (
    <LoadingBackdrop open />
  )
}

export default PropertyForm
