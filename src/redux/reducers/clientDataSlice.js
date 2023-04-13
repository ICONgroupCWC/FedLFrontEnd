import { createSlice } from '@reduxjs/toolkit'

const initialState = []
//create seperate reducer for 
  const clientDataSlice = createSlice({
    name: 'clientData',
    initialState,
    reducers: {
        addClientData: (state, action) => {
          state.length = 0;
          state.push(action.payload)
            
        }
    }
  })

  export const {addClientData} = clientDataSlice.actions
  
  export default clientDataSlice.reducer