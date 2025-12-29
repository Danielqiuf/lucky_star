import {View} from "@tarojs/components";

import {ApexFixedTabBar, TabsSwiperTab} from "@/ui";

import styles from './contacts.module.less'
import ContactsContent from "./ContactsContent";
import ContactsItem from "./ContactsItem";

const users: Array<{head: string; name:string; subtitle: string}> = [{
  head: 'https://c-ssl.dtstatic.com/uploads/blog/202307/07/V2S9pjZXSmBMX6W.thumb.400_0.png',
  name: 'Daniel',
  subtitle: '编剧'
},{
  head: 'https://img1.baidu.com/it/u=3085602167,2169866540&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
  name: 'Alieen Fullbright',
  subtitle: '执行导演、导演'
},{
  head: 'https://x0.ifengimg.com/ucms/2025_03/B30ADE86AD01A8387CD2F6D3129DA777430D9E7A_size1214_w994_h594.png',
  name: '马保国',
  subtitle: '充QB吗？？'
},{
  head: 'https://pic.qqans.com/up/2021-12/16383182375297132.jpg',
  name: '李仪敏',
  subtitle: '化妆师'
},{
  head: 'https://img1.baidu.com/it/u=914249988,2573708344&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
  name: '不愿透露名字的人',
  subtitle: '场务'
},{
  head: 'https://inews.gtimg.com/om_bt/OW896NliQIuyfwGrF4Ysg3pUi3fCuV_0IOsvuVzQlHoMAAA/641',
  name: '李相赫',
  subtitle: '编剧、执行导演'
},{
  head: 'https://img2.baidu.com/it/u=4273721645,3205551141&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
  name: 'Alice',
  subtitle: '化妆师'
}];

const user2 = [
  {
    head: 'https://wx2.sinaimg.cn/mw690/007ZtEFXgy1i35vntr43wj30u00u0gqq.jpg',
    name: '李仪敏',
    subtitle: '化妆师'
  },{
    head: 'https://inews.gtimg.com/om_bt/OW896NliQIuyfwGrF4Ysg3pUi3fCuV_0IOsvuVzQlHoMAAA/641',
    name: '李相赫',
    subtitle: '编剧、执行导演'
  },{
    head: 'https://img2.baidu.com/it/u=4273721645,3205551141&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    name: 'Alice',
    subtitle: '化妆师'
  }
]

export default function ContactsTabBar() {
  const tabs: TabsSwiperTab[] = [
    {
      key: "contacts",
      title: "联系人",
      render: () => <ContactsContent >
        {users.map(p => (
          <ContactsItem {...p} />
        ))}

      </ContactsContent>,
    },
    {
      key: "frequent",
      title: "常用联系人",
      render: () => <ContactsContent >
        {user2.map(p => (
          <ContactsItem {...p} />
        ))}

      </ContactsContent>,
    },
  ];

  return <View className={styles.tab}>
    <ApexFixedTabBar tabs={tabs} classNames={{
      tabText: styles.tab_title,
      tabTextActive: styles.tab_title_active,
      tabBar: styles.tab_bar,
      indicator: styles.tab_indicator,
      root: styles.tab_root,
      swiperWrap: styles.tab_swiper_wrap,
      swiper: styles.tab_swiper,
      swiperItem: styles.tab_swiper_item,
      content: styles.tab_swiper_item
    }} />
  </View>
}
