export const taxIdTypes = [
  { name: 'Social Security Number', id: 'SSN' },
  { name: 'Employer Identification Number', id: 'EIN' },
  { name: 'Individual Taxpayer Identification Number', id: 'ITIN' },
]

export const fields = [
  { name: 'name', label: 'Company Legal Name', required: true },
  {
    name: 'tax_id_type',
    label: 'Tax ID Type',
    options: taxIdTypes,
    select: true,
  },
  { name: 'tax_id_number', label: 'Tax ID Number' },
  {
    name: 'country_jurisdiction',
    label: 'Country/Jurisdiction of Formation',
    select: true,
    options: [{ name: 'United States', id: 'usa' }], //TODO pull this from data source
  },
  { name: 'address1', label: 'Street Address' },
  { name: 'address2', label: 'Unit' },
  { name: 'city', label: 'City' },
  {
    name: 'state_territory',
    label: 'State',
    select: true,
    options: [
      { id: 'AL', name: 'Alaska' },
      { id: 'WA', name: 'Washginton' },
    ],
  },
  { name: 'zipcode', label: 'Zip Code' },
]

export const stakeholders = [
  { name: 'board_member', label: 'Board Members' },
  { name: 'owner', label: ' Owners of 25% or More' },
  { name: 'unassigned', label: 'Unassigned' },
]
