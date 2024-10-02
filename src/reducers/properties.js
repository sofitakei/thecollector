import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { supabase } from '../supabaseClient'

// omit other imports and types

export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async id => {
    const { data } = await supabase
      .from('user_properties_view')
      .select('*')
      .eq('user_id', id)
    return data
  },
  {
    condition(arg, thunkApi) {
      const status = selectPropertiesStatus(thunkApi.getState())
      if (status !== 'idle') {
        return false
      }
    },
  }
)

const propertiesSlice = createSlice({
  name: 'properties',
  initialState: {
    byId: {},
    ids: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    propertyAdded: {
      reducer(state, action) {
        state.properties.push(action.payload)
      },
      prepare() {
        // omit prepare logic
      },
    },
    propertyUpdated(state) {
      const { id, title, content } = action.payload
      //update the existing property yere
      const existingPost = state.posts.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
  extraReducers: builder => {
    builder
      // .addCase(userLoggedOut, state => {
      //   // Clear out the list of posts whenever the user logs out
      //   return initialState
      // })
      .addCase(fetchProperties.pending, (state, action) => {
        state.status = 'pending'
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        const { payload } = action
        state.ids = payload.map(({ id }) => id)
        state.byId = payload.reduce(
          (results, u) => ((results[u.id] = u), results),
          {}
        )
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown Error'
      })
  },
})

export const { propertyAdded, propertyUpdated } = propertiesSlice.actions
export default propertiesSlice.reducer

export const selectAllProperties = state => state.properties.properties

export const selectPropertiesStatus = state => state.properties.status

export const selectPropertiesById = (state, propertyId) =>
  state.properties.properties.find(property => property.id === propertyId)
