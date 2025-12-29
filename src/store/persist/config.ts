import { createMigrate } from 'redux-persist'

import {migrations, PERSIST_VERSION } from './migrations'
import { persistStorage } from './persist'

export const persistConfig = {
  key: 'START:WEAPP:PERSIST',
  version: PERSIST_VERSION,
  storage: persistStorage,
  whitelist: [],
  migrate: createMigrate(migrations, {debug: false}),
  timeout: 10 * 1000
}
