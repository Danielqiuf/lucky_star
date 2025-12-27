import {Image, Text, View} from "@tarojs/components";

import icTopicHealth from '@/assets/images/ic_topic_health.png'
import icTopicNews from '@/assets/images/ic_topic_news.png'
import icTopicOutdoor1 from '@/assets/images/ic_topic_outdoors1.png'
import icTopicOutdoor2 from '@/assets/images/ic_topic_outdoors2.png'
import icTopicTech from '@/assets/images/ic_topic_tech.png'
import {RippleButton} from "@/ui";

import styles from './index.module.less'

type ListItem = {
  key: string;
  title: string;
  icon: string;
}

const LIST: ListItem[] = [
  {
    key: '户外',
    title: '户外',
    icon: icTopicOutdoor1
  },
  {
    key: '科技',
    title: '科技',
    icon: icTopicTech
  },
  {
    key: '户外',
    title: '户外',
    icon: icTopicOutdoor2
  },
  {
    key: '新闻',
    title: '新闻',
    icon: icTopicNews
  },
  {
    key: '健康',
    title: '健康',
    icon: icTopicHealth
  },
]

export default function HotTopic() {

  return (<View className={styles.topic}>
    <View className={styles.topic_top_title}>热门话题</View>
    <View className={styles.topic_list}>
      {LIST.map((b) => (
        <RippleButton >
          <View key={b.key} className={styles.topic_item}>
            <View className={styles.topic_icon}>
              <Image src={b.icon} mode="aspectFill" />
            </View>
            <Text className={styles.topic_title}>{b.title}</Text>
          </View>
        </RippleButton>
      ))}
    </View>
  </View>)
}
