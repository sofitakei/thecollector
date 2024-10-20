import dayjs from 'dayjs'

export const groups = [
  {
    groupLabel: 'Full legal name and date of birth',
    fields: [
      { name: 'fincen_id', label: 'FinCEN ID' },
      {
        name: 'last_name',
        label: "Individual's last name or entity's legal name",
        required: true,
      },
      { name: 'first_name', label: 'First Name', required: true },
      { name: 'middle_name', label: 'Middle Name' },
      { name: 'suffix', label: 'Suffix' },
      {
        name: 'birth_date',
        label: 'Date of Birth',
        control: 'date',
        required: true,
      },
      { name: 'email', label: 'Email' },
    ],
  },
  {
    groupLabel: '',
    fields: [
      {
        name: 'effective_date',
        label: 'Effective Date of Change',
        control: 'date',
      },
    ],
  },
  {
    groupLabel: 'Residential Address',
    fields: [
      {
        name: 'address',
        label: 'Address (number,street, and apt or suite no.)',
        required: true,
      },
      {
        name: 'city',
        label: 'City',
        required: true,
      },
      {
        name: 'country_jurisdiction',
        label: 'Country/Jurisdiction',
        required: true,
      },
      { name: 'state_id', label: 'State', required: true },
      { name: 'postal_code', label: 'ZIP/Foreign postal code', required: true },
    ],
  },
  {
    groupLabel: 'Form of identification and issuing jurisdiction',
    fields: [
      {
        name: 'document_type',
        label: 'Identifying document type',
        required: true,
      },
      {
        name: 'document_number',
        label: 'Identifying document number',
        required: true,
      },

      {
        name: 'document_country_jurisdiction',
        label: 'Identification Country/Jurisdiction',
        helperText: 'Identifying document issuing jurisdiction',
        required: true,
      },
      {
        name: 'document_jurisdiction_local_tribal_id',
        label: 'Identification Local/Tribal',
      },
      {
        name: 'document_jurisdiction_other_description',
        label: 'Identification Other local/tribal desciption',
      },
      {
        name: 'document_expiration',
        label: 'Identification Expiration Date',
        required: true,
        control: 'date',
        minDate: dayjs().add(1, 'day'),
      },
    ],
  },
]
