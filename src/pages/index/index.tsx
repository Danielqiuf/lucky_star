import { useLoad } from '@tarojs/taro'

import useScrollMemory from "@/hooks/useScrollMemory";
import PageShell from "@/pages/shell/PageShell";

import HotTopic from "./HotTopic";
import styles from './index.module.less'
import NewsUpdates from "./NewsUpdates";
import RecommendNews from "./RecommendNews";
import Userinfo from "./Userinfo";

/**
 * 首页
 * @constructor
 */
export default function Index() {
  useScrollMemory()

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <PageShell className={styles.home}>
      {/* 用户信息 */}
      <Userinfo />
      {/* 热门话题 */}
      <HotTopic />
      {/* 推荐资讯 */}
      <RecommendNews />
      {/* 新闻动态 */}
      <NewsUpdates />
    </PageShell>
  )
}
