import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import styles from './index.module.less'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className="index">
      <Text className={styles.text}>Hello2 world!</Text>
    </View>
  )
}
