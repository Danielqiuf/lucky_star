import {RootPortal, View} from "@tarojs/components";

import {useEffect, useRef, useState} from "react";

import styles from './styles/drawer_shell.module.less'


const OUT_MS = 220 // 要与 leavePanel 动画时长一致（取最大那个）

type Props = {
  open: boolean
  onClose: () => void
  width?: string // '78vw' / '600rpx' 等
  children?: React.ReactNode
}

type Phase = 'enter' | 'leave'

export default function DrawerShell({ open, onClose, width = '78vw', children }: Props) {
  const [mounted, setMounted] = useState(open)
  const [phase, setPhase] = useState<Phase>('enter')
  const tRef = useRef<any>(null)

  useEffect(() => {
    if (tRef.current) {clearTimeout(tRef.current)}

    if (open) {
      // 打开：确保挂载并播放进场
      setMounted(true)
      setPhase('enter')
      return
    }

    // 关闭：先播放退场，再卸载
    if (mounted) {
      setPhase('leave')
      tRef.current = setTimeout(() => {
        setMounted(false)
      }, OUT_MS)
    }

    return () => {
      if (tRef.current) {clearTimeout(tRef.current)}
    }
  }, [open, mounted])

  if (!mounted) {return null}

  const maskCls = phase === 'leave' ? styles.leaveMask : styles.enterMask
  const panelCls = phase === 'leave' ? styles.leavePanel : styles.enterPanel

  return (
   <RootPortal>
     <View className={styles.portal}>
       <View className={`${styles.mask} ${maskCls}`} onClick={onClose} />
       <View
         className={`${styles.panel} ${panelCls}`}
         style={{ width } as any}
         // 防止点面板也触发关闭
         onClick={(e) => e.stopPropagation?.()}
       >
         {children}
       </View>
     </View>
   </RootPortal>
  )
}

