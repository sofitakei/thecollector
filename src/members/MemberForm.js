import {
  Alert,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Fragment, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Form from '../components/Form'
import { checkEmailExists, checkForDuplicates, getFormFields } from '../utils'
import { supabase } from '../supabaseClient'
import { usePropertyContext } from '../contexts/PropertyContext'
import { useAuth } from '../contexts/AuthContext'

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

const MemberForm = ({
  count = 1,
  overrides,
  allowMultiple = false,
  handleAddMember,
}) => {
  const { setRefresh } = usePropertyContext()
  const { setRefresh: setRefreshProfile } = useAuth()
  const { propertyId } = useParams()
  const [saveDisabled, setSaveDisabled] = useState()
  const [error, setError] = useState()
  const navigate = useNavigate()
  const [managerCheckboxEnabled, setManagerCheckboxEnabled] = useState()

  const handleChange = ({ target: { value } }) => {
    setManagerCheckboxEnabled(value ? true : false)
  }

  const handleBlur = async ({ target: { value } }) => {
    const emailExists = await checkEmailExists(value)
    if (emailExists) {
      setSaveDisabled(true)
      setError(
        'The email is already in use: ' +
          value +
          '.  Try the search function above to add them'
      )
    }
  }

  const handleFocus = () => {
    setError(null)
    setSaveDisabled(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (error) {
      return
    }
    if (!saveDisabled) {
      setError(null)
      setSaveDisabled(true)
      const formFields = getFormFields(e.target)
      const members = [...Array(count).keys()].map((_, idx) => {
        const memberFields = Object.keys(formFields).filter(key =>
          key.endsWith('_' + idx)
        )

        return memberFields.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.replace('_' + idx, '')]: formFields[curr],
          }),
          {}
        )
      })

      const hasDuplicateEmails = checkForDuplicates(
        members.map(({ email }) => email)
      )

      if (hasDuplicateEmails) {
        setError('Please check you have no duplicate emails')
        setSaveDisabled(true)
        return
      }
      if (members.some(({ email, first_name }) => !email || !first_name)) {
        setSaveDisabled(false)
        setError('Name and email are required')
        return
      }
      // TODO: move this to backend
      const { data, error } = await supabase
        .from('profiles')
        .insert(
          members.map(m => {
            const { property_role, is_manager, ...rest } = m
            return rest
          })
        )
        .select()
      if (data?.length) {
        const { data: insertedMembers, error: userPropertyError } =
          await supabase
            .from('userproperty')
            .insert(
              data.map(mem => {
                const { id, email } = mem
                const { property_role, is_manager } = members.find(
                  m => email === m.email
                )
                return {
                  user_id: id,
                  property_role,
                  property_id: propertyId,
                  is_manager,
                }
              })
            )
            .select()
      }

      members.forEach(async ({ email }) => {
        const { data, error } = await supabase.functions.invoke('email', {
          body: { email },
        })
      })

      setRefresh(true)
      setRefreshProfile(true)

      navigate(`/properties/${propertyId}/payment`)
    }
  }

  return (
    <Form buttonLabel='Send' disabled={saveDisabled} onSubmit={handleSubmit}>
      {error && <Alert severity='error'>{error}</Alert>}
      <Stack width='100%' spacing={2}>
        {[...Array(count).keys()].map((_, idx) => (
          <Stack spacing={2} key={idx}>
            {allowMultiple && idx < count && (
              <Divider>Member {idx + 1}</Divider>
            )}
            {fields.map(
              ({ name, label, checkbox, options, select, required }) => (
                <Fragment key={name + '_' + idx}>
                  {checkbox ? (
                    <FormControlLabel
                      control={<Checkbox disabled={!managerCheckboxEnabled} />}
                      label={label}
                      name={name + '_' + idx}
                    />
                  ) : (
                    <TextField
                      onFocus={handleFocus}
                      fullWidth
                      label={label}
                      name={name + '_' + idx}
                      onBlur={name === 'email' ? handleBlur : () => {}}
                      onChange={name === 'email' ? handleChange : () => {}}
                      required={required}
                      select={select}
                      defaultValue={
                        name === 'property_role' ? 'unassigned' : ''
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
              )
            )}
          </Stack>
        ))}
        {allowMultiple && (
          <Button
            color='secondary'
            onClick={handleAddMember}
            variant='contained'>
            Add Member
          </Button>
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
