import { configureStore } from '@reduxjs/toolkit'
import fedDataReducer from './reducers/fedDataSlice'
import clientDataReducer from './reducers/clientDataSlice'
import processingReducer from './reducers/processingSlice'
import receivingReducer from './reducers/receivingSlice'

export default configureStore({
    reducer: {
        fedData: fedDataReducer,
        clientData:clientDataReducer,
        processing: processingReducer,
        receiving: receivingReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})