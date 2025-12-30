import {Image, ScrollView, Text, View} from "@tarojs/components";

import icQrcode from '@/assets/images/ic_qrcode.png'
import { useSafeArea} from "@/hooks";
import {DrawerListItemProps} from "@/pages/shell/types";
import {AlphaTag, cx, RectPanel, ScaleAlphaButton} from "@/ui";
import {ImageLoader} from "@/ui/ImageLoader";

import styles from './styles/drawer_content_shell.module.less'

const listItem: DrawerListItemProps[] = [
  {
    icon: 'sv_shopping',
    title: '商城'
  },
  {
    icon: 'sv_history',
    title: '浏览记录'
  },
  {
    icon: 'sv_comments',
    title: '我的评论'
  },
  {
    icon: 'sv_miniprogram',
    title: '小程序'
  },
  {
    icon: 'sv_community',
    title: '社区公约'
  },
  {
    icon: 'sv_settings',
    title: '设置'
  },
  {
    icon: 'sv_loggout',
    title: '登出'
  }
];

export default function DrawerContentShell() {
  const {insets} = useSafeArea()

  return (<View className={styles.wrap} style={{paddingTop: insets.top}}>
    <View className={styles.userinfo}>
      <View className={styles.image}>
        <ImageLoader mode='aspectFill' lazyLoad src="https://pic.xfdown.com/uploads/2021-2/2021020112042549706.jpg" />

      </View>
      <View className={styles.right_col}>
        <Text className={styles.right_col_name}>Hi, 你好啊</Text>
        <Text className={styles.right_col_subname}>执行导演、制片人</Text>
      </View>
    </View>
    <RectPanel
      topTitle="钻石级"
      centerTopTitle="积分进度"
      centerBottomTitle="2435积分于 2026-04-18过期"
      progressTitle="积分进度"
      className={styles.panel}
      rightWidget={<ScaleAlphaButton>
        <Image src={icQrcode} className={styles.panel_qrcode} />
      </ScaleAlphaButton>}
      bottomWidget={<View className={styles.panel_bottom}>
        <AlphaTag title="积分记录" clickable className={styles.panel_bottom_tag} />
        <AlphaTag title="积分规则" clickable className={styles.panel_bottom_tag} />
      </View>}
    />

    <View className={styles.scroll_wrap}>
      <ScrollView scrollY className={styles.scroll_wrap_scroll}>
        {listItem.map(t => (<ListItem key={t.title} {...t} />))}
        <View className={styles.bottom_spacer} />
      </ScrollView>
    </View>
  </View>)
}


function ListItem(props: DrawerListItemProps) {
  const {icon, title} = props;

  return (<View className={styles.list_item}>
    <View className={cx(styles.list_item_content, `luc-icon luc-icon--${icon}`)}>
      <Text className={styles.list_item_title}>{title}</Text>
    </View>

  </View>)
}



