import {Text, View} from "@tarojs/components";

import PageShell from "@/pages/shell/PageShell";

import styles from './personal.module.less'

/**
 * 个人档案
 */
export default function Personal() {

  return (<PageShell>
    <View className="index" >
      <Text className={styles.text}>个人档案</Text>
    </View>
  </PageShell>)
}
