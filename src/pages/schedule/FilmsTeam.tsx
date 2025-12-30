import {Swiper, SwiperItem, View} from "@tarojs/components";
import Taro from "@tarojs/taro";

import {useState} from "react";

import {cx, RectPanel} from "@/ui";

import styles from './schedule.module.less'
import UsersTeam from './UsersTeam'


export default function FilmsTeam() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <View className={styles.films_team}>
      <Swiper
        className={styles.films_team_swiper}
        circular={false}
        autoplay={false}
        duration={250}
        nextMargin={Taro.pxTransform(20)}
        previousMargin={Taro.pxTransform(20)}
        snapToEdge
        onChange={(e) => setActiveIndex( e?.detail?.current ?? 0)}
      >
        <SwiperItem key="item1" className={styles.films_team_swiper_item}>
          <View className={styles.films_team_panel_wrap}>
            <RectPanel
              topTitle="高优先级"
              centerTopTitle="天下无双"
              centerBottomTitle="灯光组"
              progressTitle="项目进度"
              className={styles.films_team_panel}
              rightWidget={<View className={styles.films_team_panel_right_row}>
                <View className={cx(styles.films_team_panel_right_row_icon, 'luc-icon luc-icon--Bookmark1')} />
                <View className={cx(styles.films_team_panel_right_row_icon, 'luc-icon luc-icon--more111')} />
              </View>}
              bottomWidget={<UsersTeam />}
            />
          </View>
        </SwiperItem>
        <SwiperItem key="item2" className={styles.films_team_swiper_item}>
          <View className={styles.films_team_panel_wrap}>
            <RectPanel
              topTitle="高优先级"
              centerTopTitle="天下无双"
              centerBottomTitle="灯光组"
              progressTitle="项目进度"
              className={styles.films_team_panel}
              bottomWidget={<UsersTeam />}
            />
          </View>
        </SwiperItem>
      </Swiper>
      <View className={styles.films_team_dots_wrap}>
        <View className={cx(styles.films_team_dots_wrap_dots, activeIndex === 0 && styles.films_team_dots_wrap_active)}/>
        <View className={cx(styles.films_team_dots_wrap_dots,  activeIndex === 1 && styles.films_team_dots_wrap_active)} />
      </View>
    </View>
  )
}
