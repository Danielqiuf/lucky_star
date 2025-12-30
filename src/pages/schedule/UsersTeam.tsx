import {Text, View} from "@tarojs/components";

import {cx, ImageLoader} from "@/ui";

import styles from './schedule.module.less'

export default function UsersTeam() {
  return (
    <View className={styles.users_team}>
      <View className={styles.users_team_avatars}>
        <ImageLoader src="https://q9.itc.cn/q_70/images03/20250730/7e535ac6918d44c4a0ab740ed9aa349d.jpeg" mode="aspectFill" className={styles.users_team_avatar} />
        <ImageLoader src="https://q3.itc.cn/q_70/images03/20250702/038cb73222194b66a08eb192f71b3657.jpeg" mode="aspectFill" className={styles.users_team_avatar} />
        <ImageLoader src="https://q0.itc.cn/q_70/images03/20250625/956aa14a94ad43dda0484831df476e16.jpeg" mode="aspectFill" className={styles.users_team_avatar} />
        <View className={cx(styles.users_team_avatar, styles.users_team_more)}>+2</View>
      </View>
      <View className={styles.users_team_right_row}>
        <View className={cx(styles.users_team_right_row_icon, 'luc-icon luc-icon--Chat')} />
        <Text className={styles.users_team_right_row_title}>2</Text>
        <View className={cx(styles.users_team_right_row_icon, 'luc-icon luc-icon--TimeCircle')} />
        <Text className={styles.users_team_right_row_title}>7 Days</Text>
      </View>
    </View>
  )
}
