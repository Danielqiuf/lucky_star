import {combineReducers} from "@reduxjs/toolkit";

import AppReducer from "@/store/modules/app.reducer";

export const rootReducer = combineReducers({
  app: AppReducer
});


export type RootState = ReturnType<typeof rootReducer>
