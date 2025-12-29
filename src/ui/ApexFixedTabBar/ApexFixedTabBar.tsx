import {Swiper, SwiperItem, View} from "@tarojs/components";
import Taro, {getCurrentInstance, useReady} from "@tarojs/taro";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";

import {cx} from "@/ui";

import styles from './styles/fixed_tabbar.module.less'
import {Rect, TabsSwiperProps} from "./types";



function DefaultSkeleton(props: { className?: string }) {
  return (
    <View className={cx(styles.skeleton, props.className)}>
      <View className={styles.skeletonLine} />
      <View className={styles.skeletonLine} />
      <View className={styles.skeletonLineShort} />
    </View>
  );
}

/**
 * 固定tabbar
 * @param props
 * @constructor
 */
export default function ApexFixedTabBar(props: TabsSwiperProps) {
  const {
    tabs,
    initialIndex = 0,
    current,
    onChange,
    lazy = true,
    renderSkeleton,
    swiperDuration = 250,
    swiperCircular = false,
    classNames,
  } = props;

  const isControlled = typeof current === "number";
  const [innerIndex, setInnerIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(tabs.length - 1, 0))
  );
  const activeIndex = isControlled ? (current as number) : innerIndex;

  const uidRef = useRef(`tsw_${Math.random().toString(36).slice(2, 10)}`);
  const barId = `${uidRef.current}_bar`;
  const swiperId = `${uidRef.current}_swiper`;
  const tabId = (i: number) => `${uidRef.current}_tab_${i}`;
  const titleId = (i: number) => `${uidRef.current}_title_${i}`;

  const [tabRects, setTabRects] = useState<Rect[]>([]);

  const [indicator, setIndicator] = useState<{ left: number; width: number; dragging: boolean }>({
    left: 0,
    width: 0,
    dragging: false,
  });

  const [indicatorNoAnim, setIndicatorNoAnim] = useState(true); // 初始化无动画
  const initAlignedRef = useRef(false);

  const [visited, setVisited] = useState<boolean[]>(() => tabs.map((_, i) => i === activeIndex));

  useEffect(() => {
    setVisited((prev) => tabs.map((_, i) => prev[i] ?? i === activeIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs.length]);


  useEffect(() => {
    setVisited((prev) => {
      if (prev[activeIndex]) {return prev;}
      const next = prev.slice();
      next[activeIndex] = true;
      return next;
    });
  }, [activeIndex]);

  // 在当前 page scope 里查，避免组件内 id 查不到/串到别的节点
  const queryRect = useCallback((selector: string) => {
    return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult>((resolve) => {
      const page = getCurrentInstance()?.page;
      const q = page ? Taro.createSelectorQuery().in(page) : Taro.createSelectorQuery();
      q.select(selector)
        .boundingClientRect((res) => resolve(res as any))
        .exec();
    });
  }, []);

  // 用 tabItem 的 rect 作为基准 + title 的 width 居中计算
  const measure = useCallback(async () => {
    if (!tabs.length) {return;}

    const bar = (await queryRect(`#${barId}`)) as any;

    const rects: Rect[] = [];

    for (let i = 0; i < tabs.length; i++) {
      const item = (await queryRect(`#${tabId(i)}`)) as any;
      const title = (await queryRect(`#${titleId(i)}`)) as any;

      if (!bar || !item) {
        rects.push({ left: 0, width: 0 });
        continue;
      }

      const titleWidth = title?.width ?? 0;
      const itemLeftInBar = item.left - bar.left;

      rects.push({
        width: titleWidth,
        left: itemLeftInBar + (item.width - titleWidth) / 2,
      });
    }

    setTabRects(rects);
  }, [barId, swiperId, tabs.length, queryRect]);

  useReady(() => {
    Taro.nextTick(() => {
      measure();
      setTimeout(measure, 60);
    });
  });

  const titlesSignature = useMemo(() => tabs.map((t) => String(t.title)).join("|"), [tabs]);
  useEffect(() => {
    Taro.nextTick(() => {
      measure();
      setTimeout(measure, 60);
    });
  }, [titlesSignature, measure]);

  useEffect(() => {
    const r = tabRects[activeIndex];
    if (!r) {return;}

    // 每次切换都对齐到当前 tab
    setIndicator((prev) => ({ ...prev, left: r.left, width: r.width, dragging: false }));

    if (!initAlignedRef.current) {
      initAlignedRef.current = true;
      setTimeout(() => setIndicatorNoAnim(false), 0);
    }
  }, [activeIndex, tabRects]);

  const setIndex = useCallback(
    (idx: number) => {
      const next = Math.min(Math.max(idx, 0), tabs.length - 1);
      if (!isControlled) {setInnerIndex(next);}
      onChange?.(next);
    },
    [isControlled, onChange, tabs.length]
  );

  const handleTabClick = (idx: number) => {
    setIndicator((p) => ({ ...p, dragging: false }));
    setIndex(idx);
  };

  const handleSwiperAnimationFinish = (e: any) => {
    const next = e?.detail?.current ?? 0;
    setIndex(next);
  };


  const skeletonNode = useCallback(
    (idx: number) => renderSkeleton?.(idx) ?? <DefaultSkeleton className={classNames?.skeletonWrap} />,
    [renderSkeleton, classNames?.skeletonWrap]
  );

  return (
    <View className={cx(styles.root, classNames?.root)}>
      <View id={barId} className={cx(styles.tabBar, classNames?.tabBar)}>
        {tabs.map((t, i) => {
          const active = i === activeIndex;
          return (
            <View
              id={tabId(i)}
              key={t.key}
              className={cx(
                styles.tabItem,
                classNames?.tabItem,
                active && styles.tabItemActive,
                active && classNames?.tabItemActive
              )}
              onClick={() => handleTabClick(i)}
            >
              <View
                id={titleId(i)}
                className={cx(
                  styles.tabTitleWrap,
                  classNames?.tabText,
                  active && classNames?.tabTextActive
                )}
              >
                {t.title}
              </View>
            </View>
          );
        })}

        <View
          className={cx(
            styles.indicator,
            classNames?.indicator,
            indicatorNoAnim && styles.indicatorNoAnim,
            indicator.dragging && styles.indicatorDragging,
            indicator.dragging && classNames?.indicatorDragging
          )}
          style={{
            width: `${indicator.width || 0}px`,
            transform: `translate3d(${indicator.left || 0}px, 0, 0)`,
          }}
        />
      </View>

      <View className={cx(styles.swiper_wrap, classNames?.swiperWrap)}><Swiper
        id={swiperId}
        className={cx(styles.swiper, classNames?.swiper)}
        current={activeIndex}
        duration={swiperDuration}
        circular={swiperCircular}
        onAnimationFinish={handleSwiperAnimationFinish}
      >
        {tabs.map((t, i) => (
          <SwiperItem key={t.key} className={cx(styles.swiperItem, classNames?.swiperItem)}>
            <View className={cx(styles.content, classNames?.content)}>
              {lazy && !visited[i] ? skeletonNode(i) : t.render()}
            </View>
          </SwiperItem>
        ))}
      </Swiper></View>
    </View>
  );
}
