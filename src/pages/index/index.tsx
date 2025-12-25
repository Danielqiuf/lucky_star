import {View, Text} from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import {RippleButton, toastFactory, ToastHost} from "@/ui";

import styles from './index.module.less'

/**
 * 首页
 * @constructor
 */
export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className="index" >
      <Text className={styles.text}>Hello2 world!</Text>
      <RippleButton rippleType="dark" className={styles.button} onClick={() => {

        toastFactory.show({message: 'tetstete'})
      }}><Text className={styles.inter_test}>Click me!</Text></RippleButton>

      <ToastHost />
    </View>
  )
}
