import { Text, View} from "@tarojs/components";

import {isValidElement, useState} from "react";

import {useMountedTicker} from "@/hooks";
import {cx} from "@/ui";

import AlphaTag from "../Tag/AlphaTag";
import styles from './styles/rect_panel.module.less'

import type {RectPanelProps} from './types'

export default function RectPanel(props: RectPanelProps) {
  const {rightWidget, bottomWidget, style, className} = props;

  const [percent, setPercent] = useState(0)

  useMountedTicker(() => {
    setPercent(60)
  }, 200);

  return (
    <View className={cx(styles.panel, className)} style={style}>
      <View className={styles.panel_row}>
        <AlphaTag title="钻石级" />
        {isValidElement(rightWidget) ? rightWidget : null}
      </View>
      <View className={styles.panel_scores}>8556积分</View>
      <View className={styles.panel_scores_expire}>2435积分于 2026-04-18过期</View>
      <View className={styles.panel_scores_progress_title}>积分进度</View>
      <View className={styles.panel_scores_progress_wrap}>
        <View className={cx(styles.panel_scores_progress_bar, styles.p_anim)} style={`--bar-width:${percent}%`} />
        <Text className={styles.panel_scores_progress_percent}>{percent}%</Text>
      </View>

      <View className={styles.panel_bottom}>
        {isValidElement(bottomWidget) ? bottomWidget : null}
      </View>
    </View>
  )
}
