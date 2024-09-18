import { supabase } from './supabaseClient'

export const emptyIfNull = str => (!str || str === null ? '' : str)

export const getFormFields = form => {
  const formData = Array.from(new FormData(form)).map(([k, v]) =>
    v ? [k, v] : [k, null]
  )
  return Object.fromEntries(formData)
}

export const omit = (key, obj) => {
  const { [key]: omitted, ...rest } = obj
  return rest
}

export const checkForDuplicates = arr => {
  return new Set(arr).size !== arr.length
}

export const checkEmailExists = async email => {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
  return data?.length > 0
}
