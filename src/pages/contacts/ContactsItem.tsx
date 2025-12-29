import {Text, View} from "@tarojs/components";

import {ImageLoader, RippleButton} from "@/ui";

import styles from './contacts.module.less'


export default function ContactsItem(props: {head: string; name:string; subtitle: string}) {
  const {head, name, subtitle} = props;
  return (<View className={styles.item}>
      <ImageLoader src={head} mode="aspectFill" className={styles.item_avatar} />
      <View className={styles.item_right}>
        <Text className={styles.item_name}>{name}</Text>
        <Text className={styles.item_subtitle}>{subtitle}</Text>
      </View>
    <RippleButton rippleType="dark" className={styles.item_btn_wrap}>
      <Text className={styles.item_btn_wrap_title}>认证圈友</Text>
    </RippleButton>
  </View>)
}
