import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type AppState = {
  tabBarSelected: number
  drawerOpen: boolean
}

const initialState: AppState = {
  tabBarSelected: 0,
  drawerOpen: false
}



const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTabBarSelected(state, action: PayloadAction<number>) {
      state.tabBarSelected = action.payload;
    },
    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.drawerOpen = action.payload
    }
  },
  // extraReducers
})

export const {setTabBarSelected, setDrawerOpen} = appSlice.actions;

export default appSlice.reducer;
