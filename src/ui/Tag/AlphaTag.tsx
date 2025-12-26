import {Text, View} from "@tarojs/components";

import {cx, ScaleAlphaButton} from "@/ui";

import styles from './styles/alpha_tag.module.less'

import type {AlphaTagProps} from './types'

export default function AlphaTag({ title, alpha, radius, clickable = false, className}: AlphaTagProps) {

  const child = (
    <View className={cx(styles.tag, className)} style={`${alpha !== undefined ? `--alpha:${alpha};` : ``}${radius !== undefined ? `--radius:${radius};` : ''}`}>
      <Text>{title}</Text>
    </View>
  );

  if (clickable) {
    return <ScaleAlphaButton>{child}</ScaleAlphaButton>
  }

  return child
}
