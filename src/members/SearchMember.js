import { Search } from '@mui/icons-material'
import Form from '../components/Form'
import { Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { getFormFields } from '../utils'
import { usePropertyContext } from '../contexts/PropertyContext'
import { useParams } from 'react-router-dom'

const SearchMember = () => {
  const [results, setResults] = useState()
  const { allUsersForCurrentProperty, setRefresh } = usePropertyContext()
  const [info, setInfo] = useState()
  const { propertyId } = useParams()
  const handleSubmit = async e => {
    e.preventDefault()
    setInfo(null)
    const formData = getFormFields(e.target)
    //TODO optimize and full text search for user
    const { data, error } = await supabase
      .from('profiles')
      .select('id,email, first_name,last_name')
      .eq('email', formData?.search)
    if (
      allUsersForCurrentProperty?.find(
        ({ email }) => email === data?.[0]?.email
      )
    ) {
      setInfo('This user is already part of this property')
    } else {
      setResults(data?.[0])
    }
  }

  const handleClick = async e => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('userproperty')
      .insert({
        user_id: results?.id,
        property_id: propertyId,
        property_role: 'unassigned',
      })
      .select()

    setResults(null)
    setRefresh(true)
    setInfo('Added.')
  }

  return (
    <Stack mb={2}>
      <h2>Search existing members by email to add</h2>
      <Form onSubmit={handleSubmit} buttonLabel='Search'>
        <TextField fullWidth name='search' />
      </Form>
      {info ? (
        info
      ) : results ? (
        <a href='#' onClick={handleClick}>
          Add {`${results.first_name} ${results.last_name} (${results.email})`}
        </a>
      ) : (
        'No results found'
      )}
    </Stack>
  )
}

export default SearchMember
