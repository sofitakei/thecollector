import { configureStore } from '@reduxjs/toolkit'

import propertiesReducer from '../reducers/properties'
import usersReducer from '../reducers/users'

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    users: usersReducer,
  },
})
