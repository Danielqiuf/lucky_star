import {Text, View} from "@tarojs/components";

import PageShell from "@/pages/shell/PageShell";

import styles from "./contacts.module.less";

/**
 * 通讯录
 */
export default function Contacts() {

  return (<PageShell>
    <View className="index" >
      <Text className={styles.text}>通讯录</Text>
    </View>
  </PageShell>)
}
