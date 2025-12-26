import {View, Text} from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

import PageShell from "@/pages/shell/PageShell";
import {modalFactory, RippleButton, ToastHost} from "@/ui";

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
    <PageShell>
      <View className="index" >
        <Text className={styles.text}>Hello2 world!</Text>
        <RippleButton rippleType="dark" className={styles.button} onClick={() => {

          modalFactory.show({
            confirmText: '知道了',
            centerWidget: <Text>哈哈哈啊哈</Text>
          })
        }}><Text className={styles.inter_test}>Click me!</Text></RippleButton>

        <ToastHost />
      </View>
    </PageShell>
  )
}
