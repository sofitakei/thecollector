import {
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Fragment, useState } from 'react'
import { useParams } from 'react-router-dom'

import Form from '../components/Form'
import { usePropertiesContext } from '../contexts/PropertiesContext'

const fields = [
  { name: 'first_name', label: 'First Name', required: true },
  { name: 'last_name', label: 'Last Name' },
  { name: 'email', label: 'Email', required: true },
  { name: 'is_manager', label: 'Add as Manager', checkbox: true },
  {
    name: 'property_role',
    label: 'Property Role',
    select: true,
    options: [
      { id: 'board_member', label: 'Board Member' },
      { id: 'owner', label: 'Owns 25% or More' },
      { id: 'unassigned', label: 'Unassigned' },
    ],
  },
]
const MemberForm = ({ count = 1, overrides, FormProps = {} }) => {
  const { allUsersForCurrentProperty, currentProperty, setRefresh } =
    usePropertiesContext()

  const { userId } = useParams()
  const user = allUsersForCurrentProperty.find(({ id }) => id === userId)

  const [managerCheckboxEnabled, setManagerCheckboxEnabled] = useState()
  const handleChange = ({ target: { value } }) => {
    setManagerCheckboxEnabled(value ? true : false)
  }

  return (
    <Form buttonLabel='Send' {...FormProps}>
      <Stack width='100%' spacing={2}>
        {[...Array(count).keys()].map(() =>
          fields.map(({ name, label, checkbox, options, select, required }) => (
            <Fragment key={name}>
              {checkbox ? (
                <FormControlLabel
                  control={<Checkbox disabled={!managerCheckboxEnabled} />}
                  label={label}
                  name={name}
                />
              ) : (
                <TextField
                  fullWidth
                  label={label}
                  name={name}
                  onChange={name === 'email' ? handleChange : () => {}}
                  required={required}
                  select={select}
                  defaultValue={
                    name === 'property_role' ? 'unassigned' : user?.[name]
                  }
                  {...overrides?.[name]}>
                  {options?.map(({ label, id }) => (
                    <MenuItem key={id} value={id}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Fragment>
          ))
        )}
      </Stack>
    </Form>
  )
}
MemberForm.propTypes = {
  count: PropTypes.number,
  overrides: PropTypes.object,
  FormProps: PropTypes.object,
}
export default MemberForm
