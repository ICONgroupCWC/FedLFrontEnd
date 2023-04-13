import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    processing: false
}
//create seperate reducer for 
const processingSlice = createSlice({
    name: 'processing',
    initialState,
    reducers: {
        startProcess: state => {
            state.processing = true
        }
        ,
        stopProcess: state => {
            state.processing = false
        }
    }
})

export const { startProcess, stopProcess } = processingSlice.actions

export default processingSlice.reducer