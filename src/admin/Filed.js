import LinkedCell from '../components/LinkedCell'
import PaginatedData from '../components/PaginatedData'
import { supabase } from '../supabaseClient'

const Filed = () => (
  <>
    <h4>Filed</h4>
    <PaginatedData
      supabaseFn={supabase
        .from('properties')
        .select('*, property_filing!inner(*)')
        .not('property_filing.submitted', 'is', null)}
      countSupabaseFn={supabase
        .from('properties')
        .select(' property_filing!inner(id)', { count: 'exact', head: true })
        .not('property_filing.submitted', 'is', null)}
      TableProps={{
        columns: [
          {
            name: 'name',
            label: 'Name',
            Renderer: LinkedCell,
            RendererProps: {
              type: 'property',
              getter: ({ name }) => name,
              buildUrl: ({ id }) => `/properties/${id}`,
            },
          },
          {
            name: 'filedDate',
            label: 'Filed On',
            Renderer: LinkedCell,
            RendererProps: {
              type: 'property',
              getter: ({ property_filing }) =>
                new Date(property_filing?.[0].submitted).toLocaleDateString(
                  'en-US'
                ),
              buildUrl: ({ id }) => `/properties/${id}/history`,
            },
          },
        ],
        idField: 'id',
      }}
    />
  </>
)

export default Filed
