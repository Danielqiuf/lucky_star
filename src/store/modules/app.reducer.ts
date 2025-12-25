import {createSlice} from "@reduxjs/toolkit";

type AppState = {}

const initialState: AppState = {

}


const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  // extraReducers
})

export const {} = appSlice.actions;

export default appSlice.reducer;
