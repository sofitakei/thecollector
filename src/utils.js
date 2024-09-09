export const getFormFields = form => {
  const nonEmptyFields = Array.from(new FormData(form)).filter(function ([
    k,
    v,
  ]) {
    return v
  })
  return Object.fromEntries(nonEmptyFields)
}
