import LinkedCell from '../components/LinkedCell'
import PaginatedData from '../components/PaginatedData'
import { supabase } from '../supabaseClient'

const AdminHome = () => (
  <>
    <h4>All Properties</h4>
    <PaginatedData
      supabaseFn={supabase
        .from('properties')
        .select('id, name')
        .is('deleted', null)}
      countSupabaseFn={supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .is('deleted', null)}
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
        ],
        idField: 'id',
      }}
    />
  </>
)

export default AdminHome
