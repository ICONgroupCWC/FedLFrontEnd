import { createSlice } from '@reduxjs/toolkit'

const initialState = []
//create seperate reducer for 
  const fedDataSlice = createSlice({
    name: 'fedData',
    initialState,
    reducers: {
        addFedData: (state, action) => {
          state.push(action.payload)
          
            
        }
    }
  })

  export const {addFedData} = fedDataSlice.actions
  
  export default fedDataSlice.reducer