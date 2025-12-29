
import PageShell from "@/pages/shell/PageShell";

import styles from "./contacts.module.less";
import ContactsTabBar from "./ContactsTabBar";
import Header from "./Header";

/**
 * 通讯录
 */
export default function Contacts() {

  return (<PageShell className={styles.contacts}>
    <Header />
    <ContactsTabBar />
  </PageShell>)
}
