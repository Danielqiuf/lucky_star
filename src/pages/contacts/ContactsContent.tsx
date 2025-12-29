import {ScrollView, View} from "@tarojs/components";

import {ReactNode} from "react";

import styles from './contacts.module.less'

export default function ContactsContent({children}: {children: ReactNode}) {
  return <ScrollView className={styles.tab_scroller} scrollY enhanced enableFlex >
    <View className={styles.tab_scroller_content}>
      {children}
    </View>
  </ScrollView>
}
