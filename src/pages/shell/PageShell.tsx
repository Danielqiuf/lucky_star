import {View} from "@tarojs/components";
import Taro, {getCurrentInstance, useDidShow} from "@tarojs/taro";

import {ReactNode, useState} from "react";

import DrawerContentShell from "@/pages/shell/DrawerContentShell";
import {CenteredModal, cx} from "@/ui";

import DrawerShell from "./DrawerShell";
import styles from './styles/page_shell.module.less'

export default function PageShell(props: { children: ReactNode; className?: string; }) {
  const {className, children } = props

  const [drawerOpen, setDrawerOpen] = useState(false)

  useDidShow(() => {
    const path = getCurrentInstance().router?.path || ''
    const full = path.startsWith('/') ? path : `/${path}`

    const map: Record<string, number> = {
      '/pages/index/index': 0,
      '/pages/contacts/contacts': 1,
      '/pages/checkin/checkin': 2,
      '/pages/schedule/schedule': 3,
      '/pages/personal/personal': 4,
    }

    const idx = map[full]
    if (idx === undefined) {return}

    const pageObj = getCurrentInstance().page
    const tabbar: any = Taro.getTabBar(pageObj)
    tabbar?.setSelected?.(idx)
  })

  return (
    <View className={cx(styles.page, className)} >
      <View className={styles.content}>
        {children}
      </View>

      {/* 全屏侧边栏 */}
      <DrawerShell open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerContentShell />
      </DrawerShell>

      <View className={styles.fab} onClick={() => setDrawerOpen(true)}>
        ☰
      </View>

      <CenteredModal />
    </View>
  )
}
