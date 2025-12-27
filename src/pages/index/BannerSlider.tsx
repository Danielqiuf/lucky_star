import {Swiper, SwiperItem, View} from "@tarojs/components";
import Taro from "@tarojs/taro";

import {useState} from "react";

import {cx, ImageLoader, ScaleButton} from "@/ui";

import styles from './index.module.less'

type BannerItem = {id: string; img: string; title: string; recommend?: boolean}


const BANNER: BannerItem[] = [
  {
    id: '1',
    img: 'https://thumbs.dreamstime.com/b/autumn-leaves-wet-stone-pathway-park-beautiful-fall-season-weather-night-concept-melancholy-rain-scene-wallpaper-395389772.jpg',
    recommend: true,
    title: '干货｜电影级画面怎么来？片场打光关键技巧拆解'
  },
  {
    id: '2',
    img: 'https://thumbs.dreamstime.com/z/colosseum-dusk-rome-italy-5115461.jpg?ct=jpeg',
    recommend: true,
    title: '干货2｜电影级画面怎么来？片场打光关键技巧拆解'
  },
  {
    id: '3',
    img: 'https://thumbs.dreamstime.com/z/landscape-travel-photography-camera-hobby-12353518.jpg?ct=jpeg',
    recommend: false,
    title: '干货3｜电影级画面怎么来？片场打光关键技巧拆解'
  },
  {
    id: '4',
    img: 'https://thumbs.dreamstime.com/z/photography-concept-old-camera-photos-86000148.jpg?ct=jpeg',
    recommend: false,
    title: '干货4｜电影级画面怎么来？片场打光关键技巧拆解'
  },
];

export default function BannerSwiper() {
  const [current, setCurrent] = useState(0)

  return (
    <View className={styles.banner_wrap}>
      <Swiper
        className={styles.banner_wrap_swiper}
        circular
        autoplay
        interval={3500}
        duration={260}
        previousMargin={Taro.pxTransform(28)}
        nextMargin={Taro.pxTransform(28)}
        current={current}
        onChange={(e) => setCurrent(e.detail.current)}
      >
        {BANNER.map((b, idx) => (
          <SwiperItem key={b.id} className={styles.banner_wrap_swiper_item}>
            <ScaleButton scale={0.98} className={styles.banner_wrap_item_pad}>
              <View className={cx(styles.banner_wrap_item_card, current === idx ? styles.banner_wrap_active : styles.banner_wrap_side)}>
                <ImageLoader className={styles.banner_wrap_img} mode="aspectFill" src={b.img} />
                <View className={styles.banner_wrap_title_wrap}>
                  {!!b.recommend ? <View className={styles.recommend_wrap}>推荐</View> : null}
                  <View className={styles.banner_wrap_title}>{b.title}</View>
                  <View className={styles.banner_wrap_subtitle}>刘志强 · 2分钟前 · 交流</View>
                </View>
              </View>
            </ScaleButton>
          </SwiperItem>
        ))}
      </Swiper>

      <View className={styles.banner_wrap_indicator}>
        {BANNER.map((_, i) => (
          <View key={i} onClick={() => setCurrent(i)} className={cx(styles.banner_wrap_indicator_bar, `${i === current ? styles.banner_wrap_indicator_bar_active : ''}`)} />
        ))}
      </View>
    </View>
  )

}
