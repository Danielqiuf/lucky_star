import {Text, View} from "@tarojs/components";

import {useDispatch} from "react-redux";

import {useMenuButtonRect, useSafeArea} from "@/hooks";
import {setDrawerOpen} from "@/store/modules";
import { ImageLoader, RippleButton} from "@/ui";

import styles from './schedule.module.less'

export default function Header() {
  const dispatch = useDispatch();
  const {insets} = useSafeArea()

  const rect = useMenuButtonRect();


  return (<View className={styles.header} style={{paddingTop: insets.top + rect.height}}>
    <View className={styles.userinfo}>
      <RippleButton onClick={() => dispatch(setDrawerOpen(true))} >
        <View className={styles.image}>
            <ImageLoader mode='aspectFill' lazyLoad src="https://pic.xfdown.com/uploads/2021-2/2021020112042549706.jpg" />
        </View>
      </RippleButton>
      <View className={styles.center_col}>
        <Text className={styles.center_col_title}>Hi, 张志腾</Text>
        <Text className={styles.center_col_name}>执行导演、制片人</Text>
      </View>
      <View className={styles.right_col}>
        <View className={`${styles.right_col_icon} ${styles.right_col_dot} luc-icon luc-icon--bx-bell1`} />
        <View className={`${styles.right_col_icon} luc-icon luc-icon--bx-message-square-dots`} />
      </View>
    </View>
  </View>)
}
