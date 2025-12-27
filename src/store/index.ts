import { configureStore } from '@reduxjs/toolkit'
import {persistReducer, persistStore} from 'redux-persist'

import { persistConfig } from './persist/config'
import { rootReducer } from './rootReducer'

const persistedReducer = persistReducer(persistConfig as any, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({
    serializableCheck: {
      // redux-persist 会带一些非序列化字段，忽略这些 action
      ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
    }
  })
})

export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch


