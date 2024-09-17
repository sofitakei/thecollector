//Must equal "2" EIN, "1" SSN/ITIN, or "9" Foreign.
export const taxIdTypes = [
  {
    name: 'SSN/Individual Taxpayer Identification Number',
    id: 'SSN/ITIN',
    value: 1,
  },
  { name: 'Employer Identification Number', id: 'EIN', value: 2 },
  { name: 'Foreign', id: 'foreign', value: 9 },
]

export const fields = [
  { name: 'name', label: 'Company Legal Name', required: true },
  {
    name: 'tax_id_type',
    label: 'Tax ID Type',
    options: taxIdTypes,
    select: true,
  }, //
  { name: 'tax_id_number', label: 'Tax ID Number' },
  {
    name: 'country_jurisdiction_id',
    label: 'Country/Jurisdiction of Formation',
  },
  { name: 'address1', label: 'Street Address' },
  { name: 'address2', label: 'Unit' },
  { name: 'city', label: 'City' },
  {
    name: 'state_territory',
    label: 'State',
  },
  { name: 'zipcode', label: 'Zip Code' },
  {
    name: 'property_role',
    label: 'Property Role',
    select: true,
    required: true,
    options: [
      { id: 'board_member', label: 'Board Member' },
      { id: 'owner', label: 'Owns 25% or More' },
      { id: 'nonreporting', label: 'Non-reporting' },
    ],
  },
]

export const stakeholders = [
  { name: 'board_member', label: 'Board Members' },
  { name: 'owner', label: ' Owners of 25% or More' },
  { name: 'nonreporting', label: 'Non Reporting' },
]
