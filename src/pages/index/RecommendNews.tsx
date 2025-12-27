import {ScrollView, Text, View} from "@tarojs/components";


import {AlphaButton, ImageLoader} from "@/ui";

import styles from './index.module.less'

const LIST: Array<{key: string; img: string; title: string; subTitle: string}> = [
  {
    key: 'slider_news_1',
    title: '纽约时报广场迎来年度大片取景 封闭拍摄引游客围观',
    img: 'https://images.ctfassets.net/1aemqu6a6t65/46MJ6ER585Rwl3NraEIoGL/784c5eb5d87f576b5548b1a2255f08e7/tripadvisortimessquare_taggeryanceyiv_5912?w=1200&h=800&q=75',
    subTitle: 'Stacia Key. · 1小时前 · 资讯'
  },
  {
    key: 'slider_news_2',
    title: '北京举办大型健康跑活动 助力市民拥抱运动生活',
    img: 'https://news.cgtn.com/news/2020-08-28/China-approves-city-plan-for-Beijing-core-area-TjOfFKlXHi/img/6d385bd49b6b439fa7691c57e65b8a0e/6d385bd49b6b439fa7691c57e65b8a0e.jpeg',
    subTitle: '李敏. · 10分钟前 · 资讯'
  },
  {
    key: 'slider_news_3',
    title: '纽约时报广场迎来年度大片取景 封闭拍摄引游客围观',
    img: 'https://i.natgeofe.com/k/5b396b5e-59e7-43a6-9448-708125549aa1/new-york-statue-of-liberty.jpg',
    subTitle: 'Stacia Key. · 8小时前 · 资讯'
  }
]

export default function RecommendNews() {

  return (<View className={styles.module_spacing}>
      <View className={styles.title_wrap}>
        <Text className={styles.title_wrap_top_title}>推荐资讯</Text>
        <AlphaButton>
          <Text className={styles.title_wrap_view_all}>查看全部</Text>
        </AlphaButton>
      </View>

      <View className={styles.recommend_news_slider_wrap}>
        <ScrollView
          className={styles.recommend_news_slider_scroller}
          scrollX
          enableFlex
          showScrollbar={false}
        >
          <View className={styles.recommend_news_slider_row}>
            {LIST.map((b) => (
              <View key={b.key} className={styles.recommend_news_slider_item_pad}>
                <ImageLoader prefetch={{enabled: true}} src={b.img} className={styles.recommend_news_slider_item_img} />
                <View className={styles.recommend_news_slider_item_title}>{b.title}</View>
                <View className={styles.recommend_news_slider_item_subtitle}>{b.subTitle}</View>
              </View>
            ))}
          </View>

        </ScrollView>
      </View>
    </View>
  )
}
