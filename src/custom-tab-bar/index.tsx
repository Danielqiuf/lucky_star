import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'



import icCheckIn from '@/assets/images/ic_tab_check_in.png'
import icContacts from '@/assets/images/ic_tab_contacts.png'
import icContactsActive from '@/assets/images/ic_tab_contacts_act.png'
import icHome from '@/assets/images/ic_tab_home.png'
import icHomeActive from '@/assets/images/ic_tab_home_act.png'
import icPersonal from '@/assets/images/ic_tab_personal.png'
import icPersonalActive from '@/assets/images/ic_tab_personal_act.png'
import icSchedule from '@/assets/images/ic_tab_schedule.png'
import icScheduleActive from '@/assets/images/ic_tab_schedule_act.png'
import {useSafeArea} from "@/hooks";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {setTabBarSelected} from "@/store/modules";
import {CenteredLayoutCheckIn, cx, modalFactory} from '@/ui'

import styles from './index.module.less'

type TabItem = {
  key: string
  title: string
  url: string
  icon: string
  iconActive: string
  isCenter?: boolean
}

const EVT_SET_SELECTED = 'custom-tabbar:setSelected'

const TABS: TabItem[] = [
  { key: 'index', title: 'index', url: '/pages/index/index', icon: icHome, iconActive: icHomeActive },
  { key: 'contacts', title: 'contacts', url: '/pages/contacts/contacts', icon: icContacts, iconActive: icContactsActive },
  { key: 'checkIn', title: 'checkIn', url: '/pages/checkin/index', icon: icCheckIn, iconActive: icCheckIn, isCenter: true },
  { key: 'schedule', title: 'schedule', url: '/pages/schedule/schedule', icon: icSchedule, iconActive: icScheduleActive },
  { key: 'personal', title: 'personal', url: '/pages/personal/personal', icon: icPersonal, iconActive: icPersonalActive },
]


export default function CustomTabBar() {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(s => s.app.tabBarSelected)

  const {insets} = useSafeArea()

  const switchTo = (i: number) => {
    const tab = TABS[i]
    if (!tab) {return}
    if (tab.isCenter) {
      modalFactory.show({
        centerWidget: <CenteredLayoutCheckIn />,
        confirmText: '继续',
        subText: '食宿标准'
      })
      return;
    }

    dispatch(setTabBarSelected(i))

    Taro.switchTab({
      url: tab.url,
      success: () => {
        Taro.nextTick(() => Taro.eventCenter.trigger(EVT_SET_SELECTED, i))
        setTimeout(() => Taro.eventCenter.trigger(EVT_SET_SELECTED, i), 30)
      },
    })
  }

  return (
    <View className={styles.wrap}>
      <View className={styles.bar} style={{ paddingBottom: `${insets.bottom}px` }}>
        {TABS.map((t, idx) => {
          const active = idx === selected
          return (
            <View
              key={t.key}
              className={cx(styles.item, t.isCenter && styles.centerItem, active && styles.active)}
              hoverClass={styles.pressed}
              onClick={() => switchTo(idx)}
            >
              {t.isCenter ? <View className={styles.center_icon} /> : null}
              <Image src={active ? t.iconActive : t.icon} className={styles.icon} />
            </View>
          )
        })}
      </View>
    </View>
  )
}

// 让样式能受全局影响
;(CustomTabBar as any).options = { addGlobalClass: true }
