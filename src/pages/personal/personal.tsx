
import PageShell from "@/pages/shell/PageShell";

import Header from "./Header";
import styles from './personal.module.less'

/**
 * 个人档案
 */
export default function Personal() {

  return (<PageShell className={styles.personal}>
    <Header />
  </PageShell>)
}
