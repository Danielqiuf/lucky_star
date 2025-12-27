import { ScrollView, Swiper, SwiperItem, View } from "@tarojs/components"
import Taro, { getCurrentInstance } from "@tarojs/taro"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { cx } from "@/ui"

import styles from "./styles/scrollable_tab_bar.module.less"

import type { ApexScrollableTabBarProps } from "./types"

type ExtraProps = {
  stuck?: boolean
  contentHeightPx?: number
}

const rpxToPx = (rpx: number) => {
  const { screenWidth } = Taro.getSystemInfoSync()
  return (rpx * screenWidth) / 750
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export default function ApexScrollableTabBar(props: ApexScrollableTabBarProps & ExtraProps) {
  const {
    tabs,
    defaultCurrent = 0,
    current,
    swipeable = true,
    duration = 280,
    className,
    style,
    tabBarClassName,
    tabBarInnerClassName,
    tabBarStyle,
    renderTab,
    onChange,

    //  外部传入：是否吸顶（吸顶后启用每个 tab 内部 ScrollView 滚动）
    stuck = false,
    //  外部传入：内容区高度（px）。不传则 stuck=true 时自动测剩余高度
    contentHeightPx,
  } = props

  const total = tabs.length

  // --------------------------
  // activeIndex：受控 / 非受控
  // --------------------------
  const [innerIndex, setInnerIndex] = useState(() =>
    clamp(defaultCurrent, 0, Math.max(0, total - 1)),
  )

  useEffect(() => {
    if (typeof current === "number" && Number.isFinite(current)) {
      setInnerIndex(clamp(current, 0, Math.max(0, total - 1)))
    }
  }, [current, total])

  const activeIndex = useMemo(() => {
    if (total <= 0) {return 0}
    return clamp(innerIndex, 0, total - 1)
  }, [innerIndex, total])

  // --------------------------
  // TabBar 横向滚动：保持 active tab 可见
  // --------------------------
  const [tabScrollLeft, setTabScrollLeft] = useState<number | null>(0)
  const tabScrollLeftRef = useRef(0)

  const onTabBarScroll = useCallback((e: any) => {
    tabScrollLeftRef.current = e?.detail?.scrollLeft ?? 0
  }, [])

  const scrollActiveTabIntoView = useCallback(
    (index: number) => {
      const key = tabs[index]?.key
      if (key === undefined || key === null) {return}

      const itemId = `apex_tab_${String(key)}`
      const edgePx = rpxToPx(20)

      const lastKey = tabs[tabs.length - 1]?.key
      const lastId = `apex_tab_${String(lastKey)}`

      const page = getCurrentInstance().page
      const q = Taro.createSelectorQuery().in(page!)

      q.select("#apex_tabbar").boundingClientRect()
      q.select(`#${itemId}`).boundingClientRect()
      q.select(`#${lastId}`).boundingClientRect()
      q.exec((res) => {
        const barRect = res?.[0]
        const itemRect = res?.[1]
        const lastRect = res?.[2]
        if (!barRect || !itemRect || !lastRect) {return}

        const currentLeft = tabScrollLeftRef.current

        const itemLeftInView = itemRect.left - barRect.left
        const itemRightInView =
          (itemRect.right ?? itemRect.left + itemRect.width) - barRect.left

        const minVisible = edgePx
        const maxVisible = barRect.width - edgePx

        let target = currentLeft

        if (itemLeftInView < minVisible) {
          target = currentLeft + (itemLeftInView - minVisible)
        } else if (itemRightInView > maxVisible) {
          target = currentLeft + (itemRightInView - maxVisible)
        } else {
          return
        }

        const lastRightInView =
          (lastRect.right ?? lastRect.left + lastRect.width) - barRect.left
        const maxLeft = Math.max(0, currentLeft + lastRightInView - barRect.width + edgePx)

        target = clamp(target, 0, maxLeft)

        tabScrollLeftRef.current = target
        setTabScrollLeft(target)
        setTimeout(() => setTabScrollLeft(null), 50)
      })
    },
    [tabs],
  )

  useEffect(() => {
    Taro.nextTick(() => scrollActiveTabIntoView(activeIndex))
  }, [activeIndex, scrollActiveTabIntoView])

  const userTouchingRef = useRef<Record<string, boolean>>({})

  const needRestoreRef = useRef(false)
  const isAnimatingRef = useRef(false)
  const fallbackTimerRef = useRef<number | null>(null)

  const clearFallbackTimer = () => {
    if (fallbackTimerRef.current != null) {
      clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
  }

  const commitIndex = useCallback(
    (idx: number) => {
      setInnerIndex(idx)
      onChange?.(idx, tabs[idx])
    },
    [onChange, tabs],
  )

  const startSwitch = useCallback(
    (nextIdx: number) => {
      const idx = clamp(nextIdx, 0, Math.max(0, total - 1))

      if (stuck) {
        needRestoreRef.current = true
        isAnimatingRef.current = true

        // 有些端 onAnimationFinish 可能不触发/偶发丢失：做一个兜底
        clearFallbackTimer()
        fallbackTimerRef.current = setTimeout(() => {
          if (!stuck) {return}
          if (!needRestoreRef.current) {return}
          needRestoreRef.current = false
          isAnimatingRef.current = false
        }, duration + 120) as any
      }

      commitIndex(idx)
    },
    [commitIndex, duration, stuck, total],
  )

  // 点击 tab 切换
  const onTabClick = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= total) {return}
      if (tabs[idx]?.disabled) {return}
      if (idx === activeIndex) {return}
      startSwitch(idx)
    },
    [activeIndex, startSwitch, tabs, total],
  )

  // Swiper 手势切换
  const onSwiperChange = useCallback(
    (e: any) => {
      const next = e?.detail?.current ?? 0
      startSwitch(next)
    },
    [startSwitch],
  )


  // --------------------------
  // stuck=true 且没传 contentHeightPx 时：自动测内容高度（剩余视口）
  // --------------------------
  const [autoContentHeightPx, setAutoContentHeightPx] = useState(0)

  useEffect(() => {
    if (!stuck) {return}
    if (typeof contentHeightPx === "number" && contentHeightPx > 0) {return}

    Taro.nextTick(() => {
      const page = getCurrentInstance().page
      const q = Taro.createSelectorQuery().in(page!)
      q.select("#apex_tabbar").boundingClientRect()
      q.exec((res) => {
        const rect = res?.[0]
        if (!rect) {return}
        const { windowHeight } = Taro.getSystemInfoSync()
        const bottom = rect.bottom ?? rect.top + rect.height
        setAutoContentHeightPx(Math.max(0, windowHeight - bottom))
      })
    })
  }, [stuck, contentHeightPx])

  const finalContentHeightPx =
    typeof contentHeightPx === "number" && contentHeightPx > 0
      ? contentHeightPx
      : autoContentHeightPx

  const swiperStyle = useMemo(() => {
    return finalContentHeightPx > 0 ? { height: `${finalContentHeightPx}px` } : undefined
  }, [finalContentHeightPx])

  if (!tabs || total <= 0) {
    return <View className={cx(styles.wrapper, className)} style={style} />
  }

  return (
    <View className={cx(styles.wrapper, className)} style={style}>
      {/* TabBar */}
      <ScrollView
        id="apex_tabbar"
        className={cx(styles.tabBar, tabBarClassName)}
        style={tabBarStyle}
        scrollX
        enhanced
        showScrollbar={false}
        scrollWithAnimation
        onScroll={onTabBarScroll}
        {...(tabScrollLeft !== null ? { scrollLeft: tabScrollLeft } : {})}
      >
        <View id="apex_tabbar_inner" className={cx(styles.tabBarInner, tabBarInnerClassName)}>
          {tabs.map((tab, idx) => {
            const active = idx === activeIndex
            const id = `apex_tab_${String(tab.key)}`
            return (
              <View
                id={id}
                key={String(tab.key)}
                className={cx(
                  styles.tabItem,
                  tab.tabClassName,
                  active && styles.tabItemActive,
                  active && tab.tabActiveClassName,
                  tab.disabled && styles.tabItemDisabled,
                  tab.disabled && tab.tabDisabledClassName,
                )}
                onClick={() => onTabClick(idx)}
              >
                {renderTab ? renderTab(tab, { index: idx, active }) : tab.title}
              </View>
            )
          })}
        </View>
      </ScrollView>

      {/* Content Swiper */}
      <Swiper
        className={styles.swiper}
        style={swiperStyle}
        current={activeIndex}
        duration={duration}
        circular={false}
        indicatorDots={false}
        skipHiddenItemLayout
        disableTouch={!swipeable}
        onChange={onSwiperChange}
      >
        {tabs.map((tab, idx) => {
          const keyStr = String(tab.key)
          const isActive = idx === activeIndex

          return (
            <SwiperItem key={keyStr}>
              <View className={cx(styles.page, tab.contentClassName)} style={tab.contentStyle}>
                <ScrollView
                  className={styles.contentScroll}
                  scrollY={stuck}
                  enhanced
                  showScrollbar={false}
                  // 只有“当前页”触摸才允许记忆
                  onTouchStart={() => {
                    if (isActive) {userTouchingRef.current[keyStr] = true}
                  }}
                  onTouchEnd={() => {
                    userTouchingRef.current[keyStr] = false
                  }}
                  onTouchCancel={() => {
                    userTouchingRef.current[keyStr] = false
                  }}
                >
                  {tab.render()}
                </ScrollView>
              </View>
            </SwiperItem>
          )
        })}
      </Swiper>
    </View>
  )
}
