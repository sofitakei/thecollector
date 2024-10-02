import { Alert, MenuItem, TextField } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

import Form from '../components/Form'
import { fields } from './config'
import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { getFormFields } from '../utils'
import CountryDropdown from '../components/CountryDropdown'
import { usePropertyContext } from '../contexts/PropertyContext'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import LoadingBackdrop from '../components/LoadingBackdrop'

const PropertyForm = () => {
  const navigate = useNavigate()
  const { currentProperty, setRefresh, setPropertyRefresh } =
    usePropertyContext() || {}
  const { countries, countriesByName } = usePropertiesContext()
  const [errors, setErrors] = useState()
  const {
    userProfile: { id },
  } = useAuth()

  const { propertyId: idParam } = useParams()
  console.log({ currentProperty })
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
        const { data, error } = await supabase.rpc('add_property_with_owner', {
          ...formFields,
          property_role,
          country_jurisdiction_id: country_id,
          created_by: id,
        })

        propertyId = data?.[0]?.id
      } else {
        const { data, error } = await supabase
          .from('properties')
          .update({ ...formFields, country_jurisdiction_id: country_id })
          .eq('id', currentProperty.id)
      }
      console.log('refresh here')
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
            countries={countries}
            defaultValue={countries.find(
              ({ value }) => value === currentProperty?.country_jurisdiction_id
            )}
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
    <LoadingBackdrop />
  )
}

export default PropertyForm
