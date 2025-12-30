import {Text, View} from "@tarojs/components";

import {useEffect, useRef, useState} from "react";

import {CenteredModalPayload, cx, modalFactory} from "@/ui";

import styles from './styles/centered_modal.module.less'

const ANIM_MS = 180

/**
 * 普通通用弹窗
 * @constructor
 */
export default function CenteredModal() {
  const [renderPayload, setRenderPayload] = useState<CenteredModalPayload | null>(null)
  const [leaving, setLeaving] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return modalFactory.subscribe((next) => {
      // 清理上一次的定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      if (next) {
        // show：立刻渲染并播放进入动画
        setRenderPayload(next)
        setLeaving(false)
      } else {
        // hide：先进入离场态，等动画结束再卸载
        if (!renderPayload) {return}
        setLeaving(true)
        timerRef.current = window.setTimeout(() => {
          setRenderPayload(null)
          setLeaving(false)
          timerRef.current = null
        }, ANIM_MS)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderPayload])

  useEffect(() => {
    return () => {
      if (timerRef.current) {clearTimeout(timerRef.current)}
    }
  }, [])

  if (!renderPayload) {return null}

  const {
    confirmText = '继续',
    subText,
    closeOnMask = true,
    centerWidget,
    onConfirm,
    onSubConfirm
  } = renderPayload

  const onMaskClick = () => {
    if (closeOnMask) {modalFactory.hide()}
  }

  const onConfirmClick = async () => {
    try {
      await onConfirm?.()
    } finally {
      modalFactory.hide()
    }
  }

  const onSubConfirmClick = async () => {
    try {
      await onSubConfirm?.()
    } finally {
      modalFactory.hide()
    }
  }

  return (
    <View
      className={`${styles.mask} ${leaving ? styles.maskLeave : styles.maskEnter}`}
      onClick={onMaskClick}
      catchMove
      onTouchMove={() => {}}
    >
      <View
        className={`${styles.card} ${leaving ? styles.cardLeave : styles.cardEnter}`}
        onClick={(e) => e.stopPropagation()}
      >
        {centerWidget}

        <View className={styles.btn} onClick={onConfirmClick}>
          <Text className={styles.btnText}>{confirmText}</Text>
        </View>
        {!!subText && (
          <View className={cx(styles.btn, styles.btn_sub)} onClick={onSubConfirmClick}>
            <Text className={styles.btnText}>{subText}</Text>
          </View>
        )}
      </View>
    </View>
  )
}
