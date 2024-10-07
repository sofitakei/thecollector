import { Stack, TextField, Alert } from '@mui/material'

import { useNavigate, useParams } from 'react-router-dom'

import Form from '../components/Form'

import { groups } from './config'
import { supabase } from '../supabaseClient'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { getFormFields } from '../utils'
import isEqual from 'react-fast-compare'
import { useAuth } from '../contexts/AuthContext'
import { usePropertyContext } from '../contexts/PropertyContext'
import CountryDropdown from '../components/CountryDropdown'
import Upload from '../components/Upload'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import RoleSelect from '../components/RoleSelect'
import { useEffect, useState } from 'react'
import DocumentTypeDropdown from '../components/DocumentTypeDropdown'
import LocalTribalDropdown from '../components/LocalTribalDropdown'
import ConfirmEmptyFieldsDialog from './ConfirmEmptyFieldsDialog'

const MemberProfileForm = ({ newMember = false }) => {
  const navigate = useNavigate()
  const { countriesByName } = usePropertiesContext()
  const { currentUser = {}, setRefresh } = usePropertyContext() || {}
  const { setRefresh: setProfilesRefresh } = useAuth()
  const { propertyId, userId, ...rest } = useParams()
  const [propertyRole, setPropertyRole] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [tribe, setTribe] = useState(null)
  const [error, setError] = useState()
  const [emptyRequiredFields, setEmptyRequiredFields] = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [dialogItems, setDialogItems] = useState([])
  const [formData, setFormData] = useState()
  const [photoPath, setPhotoPath] = useState()
  const handlePropertyRoleChange = (_, v) => {
    setPropertyRole(v)
  }
  const handleBlur = item => (e, val) => {
    if (item.required) {
      setEmptyRequiredFields(prev => ({
        ...prev,
        [item.name]:
          !e.target.value || e.target.value === 'MM/DD/YYYY' ? true : false,
      }))
    }
  }

  const saveItems = async (allFields = formData) => {
    const {
      auth_user_id,
      id,
      user_id,
      userproperty_id,
      userproperty_filing,
      is_manager,
      updated_at,
      property_role: pr,
      ...originalUser
    } = currentUser
    const {
      property_role,
      country_jurisdiction,
      document_country_jurisdiction,
      document_jurisdiction_local_tribal,
      ...formFields
    } = allFields
    const fieldsToSave = {
      ...formFields,
      identification_url: photoPath || currentUser?.identification_url,
      document_jurisdiction_local_tribal_id: tribe !== null ? tribe.id : null,
      document_country_jurisdiction_id:
        countriesByName?.[document_country_jurisdiction] || null,
      country_jurisdiction_id: countriesByName?.[country_jurisdiction] || null,
      ...(userId ? { id: userId } : {}),
    }
    if (isEqual(formFields, originalUser)) {
      //nothing to save
    } else {
      const { error, data } = await supabase
        .from('profiles')
        .upsert(fieldsToSave)
        .select()

      //TODO as trigger?
      const editedUserId = userId || data?.[0]?.id
      if (!newMember) {
        const { error: voidStatusError } = await supabase
          .from('userproperty_filing')
          .update({ status: 'void' })
          .eq('userproperty_id', userproperty_id)
      } else {
        await supabase.from('userproperty').insert({
          user_id: editedUserId,
          property_id: propertyId,
          property_role,
        })
      }
      if (error === null) {
        const { error: upError, data: upData } = await supabase
          .from('userproperty')
          .update({ property_role })
          .eq('user_id', editedUserId)
          .eq('property_id', propertyId)
        console.log({ upError })
        setRefresh(true)
        setProfilesRefresh(true)
        navigate(`/properties/${propertyId}/users/${editedUserId}`)
      } else {
        console.log({ error })
      }
    }
  }

  const handleUploadComplete = data => {
    setPhotoPath(data?.fullPath)
  }
  const handleSave = async e => {
    e.preventDefault()
    setError(null)
    const allFields = getFormFields(e.target)

    if (!propertyRole) {
      setError('Property role is required')
      window.scrollTo(0, 0)
      return
    }
    if (!allFields.last_name) {
      setError('Last name is required')
      window.scrollTo(0, 0)
      return
    }
    const requiredFields = groups
      .reduce((acc, { fields }) => [...acc, ...fields], [])
      .filter(({ required }) => required)
    const emptyFields = requiredFields.filter(
      ({ name }) => allFields[name] === null
    )
    setDialogItems(emptyFields)
    setFormData(allFields)
    if (emptyFields.length) {
      setFormData(allFields)
      setConfirmOpen(true)
    } else {
      saveItems(allFields)
    }
  }

  const handleDocumentChange = (e, v) => {
    setDocumentType(v.props.value)
    if (v.props.value !== 38) {
      setTribe(null)
    }
  }

  const handleTribeChange = (e, v) => {
    setTribe(v)
  }
  useEffect(() => {
    if (currentUser?.property_role) {
      setPropertyRole(currentUser.property_role)
    }
  }, [currentUser?.property_role])

  useEffect(() => {
    if (
      currentUser?.document_type &&
      currentUser?.document_type !== documentType
    ) {
      setDocumentType(currentUser?.document_type)
    }
  }, [currentUser?.document_type])

  useEffect(() => {
    if (
      currentUser?.document_jurisdiction_local_tribal_id &&
      currentUser?.document_jurisdiction_local_tribal_id !== tribe
    ) {
      setTribe({
        id: currentUser?.document_jurisdiction_local_tribal_id,
        value: currentUser?.code,
      })
    }
  }, [currentUser?.document_jurisdiction_local_tribal_id])

  if (!currentUser?.user_id && !newMember) return <div>Loading...</div>

  return (
    <>
      <Form onSubmit={handleSave}>
        {error && <Alert severity='error'>{error}</Alert>}
        <RoleSelect value={propertyRole} onChange={handlePropertyRoleChange} />
        <br />
        <h3>Edit Information</h3>
        {propertyRole !== 'nonreporting' ? (
          <>
            {groups.map(({ fields, groupLabel }) => (
              <Stack
                key={groupLabel}
                spacing={2}
                width='100%'
                mb={5}
                sx={{ '.Mui-required.empty': { color: 'error.main' } }}>
                <h4>{groupLabel}</h4>

                {fields.map(item =>
                  item.control === 'date' ? (
                    <DatePicker
                      sx={{
                        label: {
                          color: emptyRequiredFields[item.name]
                            ? 'error.main'
                            : 'inherit',
                        },
                      }}
                      key={item.name}
                      defaultValue={
                        currentUser[item.name]
                          ? dayjs(currentUser[item.name])
                          : null
                      }
                      {...item}
                      slotProps={{
                        textField: {
                          required: item.required,
                          onBlur: handleBlur(item),
                        },
                      }}
                    />
                  ) : item.name.includes('country_jurisdiction') ? (
                    <CountryDropdown
                      defaultValue={currentUser[item.name]}
                      name={item.name}
                    />
                  ) : item.name === 'document_type' ? (
                    <DocumentTypeDropdown
                      onChange={handleDocumentChange}
                      value={documentType}
                    />
                  ) : item.name === 'document_jurisdiction_local_tribal_id' ? (
                    <LocalTribalDropdown
                      value={tribe}
                      name={item.name}
                      disabled={documentType !== 38}
                      onChange={handleTribeChange}
                    />
                  ) : item.name ===
                    'document_jurisdiction_other_description' ? (
                    <TextField
                      key={item.name}
                      fullWidth
                      {...item}
                      disabled={documentType !== 38 || tribe?.id !== 588}
                      defaultValue={currentUser[item.name]}
                    />
                  ) : (
                    <TextField
                      key={item.name}
                      fullWidth
                      {...item}
                      defaultValue={currentUser[item.name]}
                      onBlur={handleBlur(item)}
                      slotProps={{
                        inputLabel: {
                          className: emptyRequiredFields[item.name]
                            ? 'empty'
                            : '',
                        },
                      }}
                    />
                  )
                )}
              </Stack>
            ))}
            <Upload
              savedPhotoPath={currentUser?.identification_url || photoPath}
              onUploadComplete={handleUploadComplete}
            />
          </>
        ) : (
          <Stack spacing={2}>
            <TextField
              fullWidth
              name='email'
              label='Email'
              defaultValue={currentUser?.email}
            />
            <TextField
              fullWidth
              name='first_name'
              label='First Name'
              defaultValue={currentUser?.first_name}
            />
            <TextField
              fullWidth
              label='Last Name'
              name='last_name'
              defaultValue={currentUser?.last_name}
            />
          </Stack>
        )}
      </Form>
      <ConfirmEmptyFieldsDialog
        items={dialogItems}
        onConfirmAction={saveItems}
        setOpen={setConfirmOpen}
        open={confirmOpen}></ConfirmEmptyFieldsDialog>
    </>
  )
}

export default MemberProfileForm
