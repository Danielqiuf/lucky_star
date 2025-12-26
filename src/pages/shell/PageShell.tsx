import {View} from "@tarojs/components";

import {ReactNode, useState} from "react";

import {useMenuButtonRect, useSafeArea} from "@/hooks";
import DrawerContentShell from "@/pages/shell/DrawerContentShell";
import {CenteredModal} from "@/ui";

import BottomTabShell from "./BottomTabShell";
import DrawerShell from "./DrawerShell";
import styles from './styles/page_shell.module.less'

export default function PageShell(props: { children: ReactNode }) {
  const { children } = props

  const {insets} = useSafeArea()

  const rect = useMenuButtonRect();

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <View className={styles.page} style={{paddingTop: insets.top + rect.height}}>
      <View className={styles.content}>
        {children}
      </View>

      {/* 自绘 Tab（固定底部） */}
      <BottomTabShell />

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
