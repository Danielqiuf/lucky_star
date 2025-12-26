import {CSSProperties, ReactNode} from "react";

export type RectPanelProps = {
  className?: string;
  style?: CSSProperties
  rightWidget?: ReactNode;
  bottomWidget?: ReactNode
}
