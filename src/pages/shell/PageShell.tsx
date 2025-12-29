import {View} from "@tarojs/components";
import Taro, {getCurrentInstance, useDidShow} from "@tarojs/taro";

import {ReactNode} from "react";
import {useDispatch} from "react-redux";

import DrawerContentShell from "@/pages/shell/DrawerContentShell";
import {useAppSelector} from "@/store/hooks";
import {setDrawerOpen} from "@/store/modules";
import {CenteredModal, cx} from "@/ui";

import DrawerShell from "./DrawerShell";
import styles from './styles/page_shell.module.less'

export default function PageShell(props: { children: ReactNode; className?: string; }) {
  const {className, children } = props

  const drawerOpen = useAppSelector(s => s.app.drawerOpen)

  const dispatch = useDispatch();

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
      {children}

      {/* 全屏侧边栏 */}
      <DrawerShell open={drawerOpen} onClose={() => dispatch(setDrawerOpen(false))}>
        <DrawerContentShell />
      </DrawerShell>

      <CenteredModal />
    </View>
  )
}
