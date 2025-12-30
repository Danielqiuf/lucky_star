import {Text, View} from "@tarojs/components";

import PageShell from "@/pages/shell/PageShell";

import styles from './checkin.module.less'

/**
 * 通讯录
 */
export default function Contacts() {

  return (<PageShell className={styles.checkin}>
    <View className="index" >
      <Text>Check in</Text>
    </View>
  </PageShell>)
}
