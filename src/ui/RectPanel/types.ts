import {CSSProperties, ReactNode} from "react";

export type RectPanelProps = {
  className?: string;
  style?: CSSProperties
  rightWidget?: ReactNode;
  bottomWidget?: ReactNode
  topTitle: string;
  centerTopTitle: string;
  centerBottomTitle?: string;
  progressTitle: string;
  theme?: 'light' | 'dark';
}
