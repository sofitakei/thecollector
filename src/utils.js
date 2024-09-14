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
