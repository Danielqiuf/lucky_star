import {Swiper, SwiperItem, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";

import {useState} from "react";

import styles from "@/pages/schedule/schedule.module.less";
import {cx, RectPanel, RippleButton} from "@/ui";

export default function DailyTask () {
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
              centerTopTitle="天下无双剧组 入组流程"

              progressTitle="进度"
              theme="light"
              className={cx(styles.films_team_panel, styles.films_team_panel_light)}
              rightWidget={<View className={cx(styles.films_team_panel_right_row_icon, 'luc-icon luc-icon--more1111')} />}
              bottomWidget={<View className={styles.bottom_btns}>
                <RippleButton rippleType="dark">
                  <View  className={styles.bottom_btns_btn_wrap}>
                   <Text>体检报告</Text>
                  </View>
                </RippleButton>
                <RippleButton rippleType="dark">
                  <View  className={styles.bottom_btns_btn_wrap}>
                    <Text>保险办理</Text>
                  </View>
                </RippleButton>
                <RippleButton rippleType="dark">
                  <View  className={styles.bottom_btns_btn_wrap}>
                    <Text>入组打卡</Text>
                  </View>
                </RippleButton>
              </View>}
            />
          </View>
        </SwiperItem>
        <SwiperItem key="item2" className={styles.films_team_swiper_item}>
          <View className={styles.films_team_panel_wrap}>
            <RectPanel
              topTitle="高优先级"
              centerTopTitle="天下无双剧组 入组流程"

              progressTitle="进度"
              theme="light"
              className={cx(styles.films_team_panel, styles.films_team_panel_light)}
              rightWidget={<View className={cx(styles.films_team_panel_right_row_icon, 'luc-icon luc-icon--more1111')} />}
              bottomWidget={<View className={styles.bottom_btns}>
                <RippleButton rippleType="dark">
                  <View  className={styles.bottom_btns_btn_wrap}>
                    <Text>体检报告</Text>
                  </View>
                </RippleButton>
                <RippleButton rippleType="dark">
                  <View  className={styles.bottom_btns_btn_wrap}>
                    <Text>保险办理</Text>
                  </View>
                </RippleButton>
                <RippleButton rippleType="dark">
                  <View  className={styles.bottom_btns_btn_wrap}>
                    <Text>入组打卡</Text>
                  </View>
                </RippleButton>
              </View>}
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
