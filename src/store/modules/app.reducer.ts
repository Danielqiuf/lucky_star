import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type AppState = {
  tabBarSelected: number
}

const initialState: AppState = {
  tabBarSelected: 0
}


const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTabBarSelected(state, action: PayloadAction<number>) {
      state.tabBarSelected = action.payload;
    }
  },
  // extraReducers
})

export const {setTabBarSelected} = appSlice.actions;

export default appSlice.reducer;
