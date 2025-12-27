import { Text, View} from "@tarojs/components";
import Taro, {getCurrentInstance, usePageScroll, useReady} from "@tarojs/taro";

import {useEffect, useMemo, useRef, useState} from "react";

import {useMenuButtonRect, useSafeArea} from "@/hooks";
import {AlphaButton, ApexScrollableTabBar, ApexTabItemConfig, cx, ImageLoader} from "@/ui";
import {SystemUtil} from "@/utils";

import styles from './index.module.less'

const TAB_TITLE = ['为你推荐','运动','科技', '片场资源', '生活与情调', '健康话题', '文化']

const TAB_CONTENT: Array<Array<{title: string; subtitle: string; img: string; }>> = [
  [{
    title: '深度睡眠的深层意义',
    subtitle: '阿琳 · 2分钟前 · 健康话题',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9KXvPSJz90SByc54stkwv_M-q1LGSxXHbVg&s'
  },
    {
      title: '赏樱品茗话风雅！日本传统文化体验季启幕',
      subtitle: '林美 · 5个月前 · 文化',
      img: 'https://www.lot.com/content/dam/lot/lot-com/destination-photos/japonia/Tokyo-5%20.coreimg.jpg/1723628368208/Tokyo-5%20.jpg'
    },
    {
      title: 'Australian IT specialist charged with espionage',
      subtitle: 'Daniel · 36分钟前 · 生活与情调',
      img: 'https://studydestination.com.au/cdn/shop/articles/Australian_Best_Cities_0be5db75-3870-4f31-bb39-19e84a6f28e4_1200x1200.jpg?v=1739815291'
    }],
  [
    {
      title: '深度睡眠的深层意义222',
      subtitle: '阿琳 · 2分钟前 · 健康话题',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9KXvPSJz90SByc54stkwv_M-q1LGSxXHbVg&s'
    },
    {
      title: '赏樱品茗话风雅！日本传统文化体验季启幕222',
      subtitle: '林美 · 5个月前 · 文化',
      img: 'https://www.lot.com/content/dam/lot/lot-com/destination-photos/japonia/Tokyo-5%20.coreimg.jpg/1723628368208/Tokyo-5%20.jpg'
    },
    {
      title: 'Australian IT specialist charged with espionage',
      subtitle: 'Daniel · 36分钟前 · 生活与情调222',
      img: 'https://studydestination.com.au/cdn/shop/articles/Australian_Best_Cities_0be5db75-3870-4f31-bb39-19e84a6f28e4_1200x1200.jpg?v=1739815291'
    },
    {
      title: 'Korea City',
      subtitle: 'Nysho · 1个月前 · 生活与情调',
      img: 'https://ik.imagekit.io/tvlk/blog/2024/06/shutterstock_2345265717.jpg?tr=q-70,c-at_max,w-1000,h-600'
    },
    {
      title: '深度睡眠的深层意义566',
      subtitle: '阿琳 · 2分钟前 · 健康话题',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9KXvPSJz90SByc54stkwv_M-q1LGSxXHbVg&s'
    },
    {
      title: '赏樱品茗话风雅！日本传统文化体验季启幕6656',
      subtitle: '林美 · 5个月前 · 文化',
      img: 'https://www.lot.com/content/dam/lot/lot-com/destination-photos/japonia/Tokyo-5%20.coreimg.jpg/1723628368208/Tokyo-5%20.jpg'
    },
    {
      title: 'Australian IT specialist charged with espiona44ge',
      subtitle: 'Daniel · 36分钟前 · 生活与情调222',
      img: 'https://studydestination.com.au/cdn/shop/articles/Australian_Best_Cities_0be5db75-3870-4f31-bb39-19e84a6f28e4_1200x1200.jpg?v=1739815291'
    },
    {
      title: 'Korea City55',
      subtitle: 'Nysho · 1个月前 · 生活与情调',
      img: 'https://ik.imagekit.io/tvlk/blog/2024/06/shutterstock_2345265717.jpg?tr=q-70,c-at_max,w-1000,h-600'
    },{
    title: '深度睡眠的深层意义2775',
    subtitle: '阿琳 · 2分钟前 · 健康话题',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9KXvPSJz90SByc54stkwv_M-q1LGSxXHbVg&s'
  },
    {
      title: '赏樱品茗话风雅！日本传统文化体验季启幕3322',
      subtitle: '林美 · 5个月前 · 文化',
      img: 'https://www.lot.com/content/dam/lot/lot-com/destination-photos/japonia/Tokyo-5%20.coreimg.jpg/1723628368208/Tokyo-5%20.jpg'
    },
    {
      title: 'Australian IT specialist charged with es44pionage',
      subtitle: 'Daniel · 36分钟前 · 生活与情调222',
      img: 'https://studydestination.com.au/cdn/shop/articles/Australian_Best_Cities_0be5db75-3870-4f31-bb39-19e84a6f28e4_1200x1200.jpg?v=1739815291'
    },
    {
      title: 'Korea City1231',
      subtitle: 'Nysho · 1个月前 · 生活与情调',
      img: 'https://ik.imagekit.io/tvlk/blog/2024/06/shutterstock_2345265717.jpg?tr=q-70,c-at_max,w-1000,h-600'
    },
    {
      title: 'Australian IT specialist charged with es44pionage',
      subtitle: 'Daniel · 36分钟前 · 生活与情调222',
      img: 'https://studydestination.com.au/cdn/shop/articles/Australian_Best_Cities_0be5db75-3870-4f31-bb39-19e84a6f28e4_1200x1200.jpg?v=1739815291'
    },
    {
      title: 'Korea City1231',
      subtitle: 'Nysho · 1个月前 · 生活与情调',
      img: 'https://ik.imagekit.io/tvlk/blog/2024/06/shutterstock_2345265717.jpg?tr=q-70,c-at_max,w-1000,h-600'
    },
    {
      title: 'Australian IT specialist charged with es44pionage',
      subtitle: 'Daniel · 36分钟前 · 生活与情调222',
      img: 'https://studydestination.com.au/cdn/shop/articles/Australian_Best_Cities_0be5db75-3870-4f31-bb39-19e84a6f28e4_1200x1200.jpg?v=1739815291'
    },
    {
      title: 'Korea City1231',
      subtitle: 'Nysho · 1个月前 · 生活与情调',
      img: 'https://ik.imagekit.io/tvlk/blog/2024/06/shutterstock_2345265717.jpg?tr=q-70,c-at_max,w-1000,h-600'
    },{
    title: 'Australian IT specialist charged with es44pionage',
    subtitle: 'Daniel · 36分钟前 · 生活与情调222',
    img: 'https://studydestination.com.au/cdn/shop/articles/Australian_Best_Cities_0be5db75-3870-4f31-bb39-19e84a6f28e4_1200x1200.jpg?v=1739815291'
  },
    {
      title: 'Korea City1231',
      subtitle: 'Nysho · 1个月前 · 生活与情调',
      img: 'https://ik.imagekit.io/tvlk/blog/2024/06/shutterstock_2345265717.jpg?tr=q-70,c-at_max,w-1000,h-600'
    }
  ],
  [
    {
      title: '深度睡眠的深层意义333',
      subtitle: '阿琳 · 2分钟前 · 健康话题',
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9KXvPSJz90SByc54stkwv_M-q1LGSxXHbVg&s'
    },
    {
      title: '赏樱品茗话风雅！日本传统文化体验季启幕333',
      subtitle: '林美 · 5个月前 · 文化',
      img: 'https://www.lot.com/content/dam/lot/lot-com/destination-photos/japonia/Tokyo-5%20.coreimg.jpg/1723628368208/Tokyo-5%20.jpg'
    },
    {
      title: 'Australian IT specialist charged with espionage',
      subtitle: 'Daniel · 36分钟前 · 生活与情调333',
      img: 'https://studydestination.com.au/cdn/shop/articles/Australian_Best_Cities_0be5db75-3870-4f31-bb39-19e84a6f28e4_1200x1200.jpg?v=1739815291'
    }
  ]
];


export default function NewsUpdates() {
  const [curr, setCurr] = useState(0)

  const {insets} = useSafeArea();
  const menuRect = useMenuButtonRect()

  const barTopInPageRef = useRef<number | null>(null)
  const [stuck, setStuck] = useState(false)

  const stickyTopPx = useMemo(() => insets.top + menuRect.height, [insets, menuRect])

  const pageScrollTopRef = useRef(0)

  const tabOffsetRef = useRef<Record<number, number>>({})

  const sys = Taro.getSystemInfoSync()
  const winH = sys.windowHeight

  const wrapperH = winH - stickyTopPx - SystemUtil.rpx2px(338);

  const TABS: ApexTabItemConfig[] = useMemo(() => Array.from({length: 7}).map((_, i) => ({
    key: i,
    title: TAB_TITLE[i],
    tabClassName: styles.news_updates_tab,
    tabActiveClassName: styles.news_updates_tab_active,
    render: () => <TabContent tab={i} />
  })), [])

  useReady(() => {
    const page = getCurrentInstance().page
    Taro.nextTick(() => {
      const q = Taro.createSelectorQuery().in(page!)
      q.select("#apex_tabbar").boundingClientRect()
      q.selectViewport().scrollOffset()
      q.exec((res) => {
        const rect = res?.[0]
        const vp = res?.[1]
        if (!rect || !vp) {return}
        barTopInPageRef.current = rect.top + vp.scrollTop
      })
    })
  })

  usePageScroll(({ scrollTop }) => {
    pageScrollTopRef.current = scrollTop

    const barTop = barTopInPageRef.current
    if (barTop == null) {return}

    const nextStuck = scrollTop + stickyTopPx >= barTop
    setStuck(nextStuck)

    if (nextStuck) {
      const baseTop = barTop - stickyTopPx          // tabbar 刚好吸顶时的 pageScrollTop
      tabOffsetRef.current[curr] = Math.max(0, scrollTop - baseTop)
    }
  })

  const handleTabChange = (nextIdx: number) => {
    const barTop = barTopInPageRef.current
    if (barTop == null) {
      setCurr(nextIdx)
      return
    }

    const baseTop = barTop - stickyTopPx
    if (stuck) {
      tabOffsetRef.current[curr] = Math.max(0, pageScrollTopRef.current - baseTop)
    }

    setCurr(nextIdx)

    if (stuck) {
      const nextOffset = tabOffsetRef.current[nextIdx] ?? 0
      Taro.nextTick(() => {
        Taro.pageScrollTo({
          scrollTop: baseTop + nextOffset,
          duration: 0,
        })
      })
    }
  }

  useEffect(() => {
    Taro.setNavigationBarColor({
      frontColor: stuck ? '#000000' : "#ffffff",
      backgroundColor: '#ffffff',
      animation: {
        duration: 300,
        timingFunc: 'easeIn'
      }
    })
  }, [stuck])


  return (<View className={styles.module_spacing}>
    <View className={styles.title_wrap}>
      <Text className={styles.title_wrap_top_title}>动态</Text>
      <AlphaButton>
        <Text className={styles.title_wrap_view_all}>查看全部</Text>
      </AlphaButton>
    </View>
    <View className={styles.news_updates_scroller_wrap}>
      {stuck && (
        <View
          className={styles.safe_top_mask}
          style={{ height: `${stickyTopPx}px` }}
        />
      )}
      <ApexScrollableTabBar
        tabBarClassName={styles.news_updates_bar}
        tabBarInnerClassName={styles.news_updates_bar_inner}
        tabBarStyle={{ top: `${stickyTopPx}px` }}
        tabs={TABS}
        stuck={stuck}
        contentHeightPx={wrapperH}
        preload={2}
        current={curr}
        onChange={handleTabChange}
        swipeable
      />
    </View>
  </View>)
}


function TabContent({tab}: {tab: number;}) {
  const contents = TAB_CONTENT[tab] ?? [];


  return (<View className={cx(styles.news_updates_tab_content, contents.length === 0 ? styles.news_updates_tab_content_center : '')}>
    {contents.length === 0 ? (<Text className={styles.news_updates_tab_content_subtitle}>暂无内容</Text>) : contents.map((v) => (
      <View className={styles.news_updates_tab_content_wrap}>
        <ImageLoader src={v.img} className={styles.news_updates_tab_content_img} mode="aspectFill" />
        <View className={styles.news_updates_tab_content_right}>
          <View className={styles.news_updates_tab_content_title}>{v.title}</View>
          <View className={styles.news_updates_tab_content_subtitle}>{v.subtitle}</View>
        </View>
      </View>
    ))}
  </View>)
}
