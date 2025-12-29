import {Input, View} from "@tarojs/components";

import {useMenuButtonRect, useSafeArea} from "@/hooks";

import styles from './contacts.module.less'

export default function Header() {
  const {insets} = useSafeArea()
  const rect = useMenuButtonRect()

  return (<View className={styles.header} style={{paddingTop: insets.top + rect.height}}>
    <View className={styles.header_content}>
      <View className={styles.header_title}>福星圈</View>
      <View className={styles.header_search_wrap}>
        <Input className={styles.header_search}  type="text" placeholder="搜索联系人" placeholderClass={styles.header_search_placeholder} />
      </View>
    </View>
  </View>)
}
