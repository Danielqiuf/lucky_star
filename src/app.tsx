import { useLaunch } from '@tarojs/taro'

import { PropsWithChildren } from 'react'
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";

import {store, persistor} from "@/store";
import './app.less'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  return <Provider store={store}>
   <PersistGate persistor={persistor} >
     {children}
   </PersistGate>
  </Provider>
}

export default App
