import {ReactNode} from "react";

export type TabKey = string | number;

export type TabsSwiperTab = {
  key: TabKey;
  title: ReactNode; // 一般是 string，也支持 ReactNode
  render: () => ReactNode;
};

export type Rect = { left: number; width: number };

export type TabsSwiperClassNames = Partial<{
  root: string;
  tabBar: string;
  tabItem: string;
  tabItemActive: string;
  tabText: string;
  tabTextActive: string;
  indicator: string;
  indicatorDragging: string;
  swiperWrap: string
  swiper: string;
  swiperItem: string;
  content: string;
  skeletonWrap: string;
}>;

export type TabsSwiperProps = {
  tabs: TabsSwiperTab[];
  initialIndex?: number;

  swiperH?: number
  /** 可控模式 */
  current?: number;
  onChange?: (index: number) => void;

  /** 懒渲染：未访问过的页渲染骨架屏，访问后再 mount 真内容 */
  lazy?: boolean;

  /** 自定义骨架屏（你也可以在这里接第三方 Skeleton 组件） */
  renderSkeleton?: (index: number) => React.ReactNode;

  /** 透传 Swiper 常用参数 */
  swiperDuration?: number;
  swiperCircular?: boolean;

  /** 外部可覆盖样式的 className */
  classNames?: TabsSwiperClassNames;
};
