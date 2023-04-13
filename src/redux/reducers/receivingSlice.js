import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    receiving: false
}
//create seperate reducer for 
const receivingSlice = createSlice({
    name: 'receiving',
    initialState,
    reducers: {
        startReceive: state => {
            state.receiving = true
        }
        ,
        stopReceive: state => {
            state.receiving = false
        }
    }
})

export const { startReceive, stopReceive } = receivingSlice.actions

export default receivingSlice.reducer