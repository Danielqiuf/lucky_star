export const PERSIST_VERSION = 1;


export const migrations: Record<number, (state: any) => any> = {
  0: (state) => state,
  1: (state) => {
    // @TODO 老版本与新版本相关迁移
   return state;
  }
}
