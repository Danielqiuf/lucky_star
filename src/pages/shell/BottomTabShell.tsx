import {Image, View} from "@tarojs/components";
import Taro from "@tarojs/taro";

import { useMemo} from "react";

// ---- icon --- //
import icCheckIn from '@/assets/images/ic_tab_check_in.png'
import icContacts from '@/assets/images/ic_tab_contacts.png'
import icContactsActive from '@/assets/images/ic_tab_contacts_act.png'
import icHome from '@/assets/images/ic_tab_home.png'
import icHomeActive from '@/assets/images/ic_tab_home_act.png'
import icPersonal from '@/assets/images/ic_tab_personal.png'
import icPersonalActive from '@/assets/images/ic_tab_personal_act.png'
import icSchedule from '@/assets/images/ic_tab_schedule.png'
import icScheduleActive from '@/assets/images/ic_tab_schedule_act.png'
import {useCurrentPath, useSafeArea} from "@/hooks";
import {usePressed, cx} from "@/ui";

import styles from './styles/bottom_tab_shell.module.less'
import {TabItem} from "./types";



const TABS: TabItem[] = [
  // 首页
  {
    key: 'index',
    title: 'index',
    url: '/pages/index/index',
    icon: icHome,
    iconActive: icHomeActive
  },
  // 通讯录
  {
    key: 'contacts',
    title: 'contacts',
    url: '/pages/contacts/contacts',
    icon: icContacts,
    iconActive: icContactsActive,

  },
  {
    key: 'checkIn',
    title: 'checkIn',
    url: '/pages/contacts/contacts',
    icon: icCheckIn,
    iconActive: icCheckIn,
    isCenter: true
  },
  // 日程
  {
    key: 'schedule',
    title: 'schedule',
    url: '/pages/schedule/schedule',
    icon: icSchedule,
    iconActive: icScheduleActive
  },
  // 个人信息
  {
    key: 'personal',
    title: 'personal',
    url: '/pages/personal/personal',
    icon: icPersonal,
    iconActive: icPersonalActive
  }
]

export default function BottomTabShell() {
  const currentPath = useCurrentPath();

  const {insets} = useSafeArea();

  const tabs = useMemo(() => TABS, [])

  const onSwitch = (url: string) => {
    if (url === currentPath) {return}
    Taro.reLaunch({ url })
  }

  return (
    <View className={styles.wrap}>
      <View className={styles.bar} style={{paddingBottom: insets.bottom}}>
        {tabs.map((t) => {
          const active = t.url === currentPath
          const isCenter = !!t.isCenter

          return <BottomTabItem  {...t} center={isCenter} active={active} onSwitch={() => onSwitch(t.url)} />
        })}
      </View>
    </View>
  );
}

function BottomTabItem({ key, url, iconActive, icon, active, center, onSwitch }: TabItem & {key: string;active: boolean; center: boolean;onSwitch: (string) => void;}) {
  const { pressed, onTouchStart, onTouchEnd, onTouchCancel } = usePressed(false)

  return (
    <View
      key={key}
      className={cx(styles.item, pressed && styles.pressed)}
      onTouchStart={() => onTouchStart()}
      onTouchEnd={() => onTouchEnd()}
      onTouchCancel={() => onTouchCancel()}
      onClick={() => onSwitch(url)}
    >
      {center ? <View className={styles.center_icon} /> : null}
      <Image src={active ? iconActive : icon} className={styles.icon} />
    </View>
  )
}
