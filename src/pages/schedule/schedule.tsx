import { useLoad } from '@tarojs/taro'

import DailyTask from "@/pages/schedule/DailyTask";
import FilmsTeam from "@/pages/schedule/FilmsTeam";
import PageShell from "@/pages/shell/PageShell";

import ModuleTitle from './ModuleTitle'
import styles from './schedule.module.less'
import Userinfo from './Userinfo'


/**
 * 日程
 * @constructor
 */
export default function Schedule() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <PageShell className={styles.schedule}>
      <Userinfo />
      <ModuleTitle title="你的剧组" />
      <FilmsTeam />
      <ModuleTitle title="今日任务" subtitle="2025年9月23日 星期二" />
      <DailyTask />
    </PageShell>
  )
}
