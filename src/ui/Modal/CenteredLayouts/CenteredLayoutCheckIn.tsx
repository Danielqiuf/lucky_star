import {Image, View} from "@tarojs/components";

import icModalSuccessful from '@/assets/images/ic_modal_successful.png'

import styles from '../styles/centered_layout_check_in.module.less'

export default function CenteredLayoutCheckIn() {
  return (<View className={styles.centered_layout}>
    <View className={styles.centered_layout_map}/>
    <Image src={icModalSuccessful} className={styles.centered_layout_img} />
    <View className={styles.centered_layout_title}>打卡成功</View>
  </View>)
}
