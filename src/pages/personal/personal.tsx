
import {View} from "@tarojs/components";

import PageShell from "@/pages/shell/PageShell";

import Header from "./Header";
import styles from './personal.module.less'

/**
 * 个人档案
 */
export default function Personal() {

  return (<PageShell className={styles.personal}>
    <Header />

    <View style={{padding: '100rpx 40rpx', fontSize: '40rpx',textAlign: 'center'}}>Hello World!</View>
  </PageShell>)
}
