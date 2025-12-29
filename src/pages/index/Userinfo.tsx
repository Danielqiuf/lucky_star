import {Text, View} from "@tarojs/components";

import {useDispatch} from "react-redux";

import {useMenuButtonRect, useSafeArea} from "@/hooks";
import BannerSlider from "@/pages/index/BannerSlider";
import {setDrawerOpen} from "@/store/modules";
import {cx, ImageLoader, RippleButton} from "@/ui";

import styles from './index.module.less'

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
      <View className={styles.right_col}>
        <Text className={styles.right_col_title}>制片人</Text>
        <Text className={styles.right_col_name}>张志腾</Text>
      </View>
      <View className={styles.search_wrap}>
        <Text className={cx(styles.search_wrap_icon, `luc-icon luc-icon--search-normal`)} />
      </View>
    </View>
    {/* Banner */}
    <BannerSlider />
  </View>)
}
