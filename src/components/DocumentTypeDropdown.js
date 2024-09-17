import { MenuItem, TextField } from '@mui/material'

export const documentTypes = [
  { value: 37, label: "State issued driver's license" },
  { value: 38, label: 'State/local/tribe-issued ID' },
  { value: 39, label: 'U.S. passport' },
  { value: 40, label: 'Foreign passport' },
]
const DocumentTypeDropdown = props => {
  return (
    <TextField select name='document_type' {...props}>
      {documentTypes.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default DocumentTypeDropdown
