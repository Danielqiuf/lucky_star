import { Text, View} from "@tarojs/components";

import {isValidElement, useState} from "react";

import {useMountedTicker} from "@/hooks";
import {cx} from "@/ui";

import AlphaTag from "../Tag/AlphaTag";
import styles from './styles/rect_panel.module.less'

import type {RectPanelProps} from './types'

export default function RectPanel(props: RectPanelProps) {
  const {theme = 'dark', topTitle, centerTopTitle, centerBottomTitle,progressTitle, rightWidget, bottomWidget, style, className} = props;

  const [percent, setPercent] = useState(0)


  useMountedTicker(() => {
    setPercent(60)
  }, 200);

  return (
    <View className={cx(styles.panel, theme === 'light' ? styles.light : styles.dark, className)} style={style}>
      <View className={styles.panel_row}>
        <AlphaTag title={topTitle} className={styles.panel_top_tag} />
        {isValidElement(rightWidget) ? rightWidget : null}
      </View>
      <View className={styles.panel_scores}>{centerTopTitle}</View>
      {!!centerBottomTitle && <View className={styles.panel_scores_expire}>{centerBottomTitle}</View>}

      <View className={styles.panel_scores_progress_title}>{progressTitle}</View>
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
