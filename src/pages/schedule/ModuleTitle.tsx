import {Text, View} from "@tarojs/components";

import {AlphaButton} from "@/ui";

import styles from './schedule.module.less'

export default function ModuleTitle({title, subtitle}:{title: string; subtitle?: string}) {

  return (
    <View className={styles.module_title}>
      <Text className={styles.module_title_title}>{title}</Text>
      {!!subtitle && (
        <Text className={styles.module_title_subtitle}>{subtitle}</Text>
      )}
      <AlphaButton>
        <Text className={styles.module_title_all_btn}>查看全部</Text>
      </AlphaButton>
    </View>
  )
}
