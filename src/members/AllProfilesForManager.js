import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import MemberDetails from './MemberDetails'
import { useState } from 'react'
import { usePropertyContext } from '../contexts/PropertyContext'
import { useAuth } from '../contexts/AuthContext'
import PropertyDashboardButton from '../components/PropertyDashboardButton'
import { fields, taxIdTypes } from '../properties/config'
import { useCountries } from '../hooks/useCountries'

const filingStatus = [
  { value: 'initial', label: 'Initial Report' },
  { value: 'correct', label: 'Correct Prior Report' },
  { value: 'update', label: 'Update Prior Report' },
  { value: 'new', label: 'Newly Exempt' },
]
const AllProfilesForManager = () => {
  const { allUsersForCurrentProperty, propertyUsers, currentProperty } =
    usePropertyContext()
  const { propertyId } = useParams()
  const [status, setStatus] = useState('initial')
  const [verified, setVerified] = useState(false)
  const { countries } = useCountries()
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const { property_role, ...propertyFields } = fields
  //TODO: finish reading the API docs
  const formatFiling = () => {
    const filing = {
      SubmitterElectronicAddressText: userProfile?.email,
      SubmitterEntityIndivdualLastName: userProfile?.last_name,
      SubmitterIndivdualFirstName: userProfile?.first_name,
      //Type of filing (i.e., Initial report, Correct prior report, Update prior report, or Newly exempt entity)
      Activity: {
        attributes: [{ SeqNum: 1 }],
        //Item 2 – Date prepared
        ApprovalOfficialSignatureDateText: new Date(),
        //Item 1f –Reporting Company tax identification number
        EFilingPriorReportingCompanyIdentificationNumberText:
          currentProperty?.tax_id_number,
        //. Item 1g – Reporting Company tax identification type
        EFilingPriorReportingCompanyIdentificationTypeCode:
          currentProperty?.tax_id_type,
        //Item 1h – Reporting Company country/jurisdiction (if foreign tax ID only)
        EFilingPriorReportingCompanyIssuerCountryCodeText:
          currentProperty?.country_jurisdiction,
        //Item 1e – Reporting Company legal name
        EFilingPriorReportingCompanyName: currentProperty?.name,
        //This element must be recorded and must be null (e.g.<fc2:FilingDateText/>)
        FilingDateText: null,
        //Type of filing (i.e., Initial report, Correct prior report, Update prior report, or Newly exempt entity)
        ActivityAssociation: {
          //. Item 1b – Correct prior report
          CorrectsAmendsPriorReportIndicator: status === 'correct',
          //Item 1a – Initial report
          InitialReportIndicator: status === 'initial',
          // Item 1d – Newly exempt entity
          ReportingCompanyBecameExemptIndicator: status === 'new',
          //Item 1c – Update prior report
          UpdatePriorReportIndicator: status === 'update',
        },
        // Information about the Reporting Company, Company Applicant(s), and Beneficial Owner(s) on the report (one part for each).
        Party: {
          //(code 62)
          ActivityPartyTypeCode: 62,
          // Item 16 – Existing Reporting Company
          ExistingReportingCompanyIndicator: null, //TODO
          //Item 10f – Tribal jurisdiction of first registration
          FirstRegistrationLocalTribalCodeText: null, //TODO,
          //Item 10e – State of first registration (or U.S. Territory of first registration)
          FirstRegistrationStateCodeText: null,
          // Item 10a – Country/Jurisdiction of formation (U.S., U.S. Territory, or foreign country)
          FormationCountryCodeText: null,
          // Item 10c – Tribal jurisdiction of formation
          FormationLocalTribalCodeText: null,
          //Item 10b – State of formation (or U.S. Territory of formation)
          FormationStateCodeText: null,
          //Item 10g – Name of the other Tribe (of first registration)
          OtherFirstRegistrationLocalTribalText: null,
          //Item 10d – Name of the other Tribe (of formation)
          OtherFormationLocalTribalText: null,
          //Item 3 – Request to receive FinCEN Identifier (FinCEN ID)
          RequestFinCENIDIndicator: null,
          // Item 5 – Reporting Company legal name
          PartyName: {
            //Must equal "L" to associate this PartyName information with the legal name.
            PartyNameTypeCode: 'L',
            //Reporting company legal name
            RawPartyFullName: null,
          },
          //Item 6 – Alternate name (99 maximum)
          // PartyName: {
          //   //Must equal "DBA" to associate this PartyName information with the alternate name.
          //   PartyNameTypeCode: 'DBA'
          // },
          // Items 11-15 (Current U.S. address)
          Address: {
            attributes: [{ SeqNum: 1 }],
            RawCityText: null,
            RawCountryCodeText: null,
            RawStateCodeText: null,
            RawStreetAddress1Text: null,
            RawZIPCode: null,
          },
          //Items 7-9 (Form of identification)
          PartyIdentification: {},
          //Item 4 – Foreign pooled investment vehicle
          OrganizationClassificationTypeSubtype: {},
          ...allUsersForCurrentProperty.map(
            ({ filingdata }) => filingdata?.filingdata
          ),
        },
      }, //allUsersForCurrentProperty.map(({ filingData }) => filingData),
    }
    return filing
  }
  const handleSubmit = async e => {
    const { data, error } = await supabase.from('property_filing').insert({
      property_id: propertyId,
      status: 'verified',
      filing: allUsersForCurrentProperty.map(
        ({ filingdata }) => filingdata?.filingdata || filingdata
      ),
    })
    console.log({ data, error })
    navigate('/')
  }

  return (
    <Stack>
      <Typography variant='h4'>
        Here is your form information for {currentProperty?.name}
      </Typography>
      <FormControl>
        <RadioGroup
          onChange={(_, v) => {
            setStatus(v)
          }}
          value={status}
          row
          name='filing_status'>
          {filingStatus.map(({ value, label }) => (
            <FormControlLabel
              control={<Radio />}
              key={value}
              value={value}
              label={label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {fields.map(field =>
        field.name !== 'property_role' ? (
          <Stack
            direction='row'
            justifyContent='space-between'
            key={field.name}>
            <Typography
              sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
              {field.label}
            </Typography>
            <Typography
              sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
              {field.name === 'country_jurisdiction_id'
                ? countries.find(
                    ({ value }) =>
                      value === currentProperty.country_jurisdiction_id
                  )?.label
                : field.name === 'tax_id_type'
                ? taxIdTypes.find(
                    ({ value }) => `${value}` === currentProperty.tax_id_type
                  )?.name
                : currentProperty?.[field.name]}
            </Typography>
          </Stack>
        ) : null
      )}
      {[...propertyUsers.owner, ...propertyUsers.board_member].map(
        (user, idx) => {
          return (
            <div key={idx}>
              <Divider sx={{ my: 2 }}>
                {user.first_name} {user.last_name}
              </Divider>
              <MemberDetails user={user} />
              <Link to={`/properties/${propertyId}/users/${user.user_id}/edit`}>
                Edit Member
              </Link>
            </div>
          )
        }
      )}
      <Divider sx={{ my: 3 }}></Divider>
      <PropertyDashboardButton />
      <FormControlLabel
        control={
          <Checkbox
            color='primary'
            value='confirmInfo'
            checked={verified}
            onChange={() => {
              setVerified(ver => !ver)
            }}
          />
        }
        label='I verify all above information is correct.'
      />
      <Button variant='contained' disabled={!verified} onClick={handleSubmit}>
        Submit and Complete Filing
      </Button>
    </Stack>
  )
}

export default AllProfilesForManager
