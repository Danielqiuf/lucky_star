import {View, Text} from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import PageShell from "@/pages/shell/PageShell";

import styles from './schedule.module.less'

/**
 * 日程
 * @constructor
 */
export default function Schedule() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <PageShell>
      <View className="index" >
        <Text className={styles.text}>日程</Text>
      </View>
    </PageShell>
  )
}
