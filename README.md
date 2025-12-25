## 福星圈 (基于 Taro4 跨端框架开发)
---------------
### 框架技术生态
- `Redux/Redux toolkit` **状态管理**
-` Redux Persist` **本地持久化**
- `Axios` **网络请求**
- `Prettier + ESLint` **代码格式化/美化**
- `Webpack5` **构建工具**
- `TypeScript` **TS**

--------------

### 运行

- `yarn install` 安装依赖
- `yarn dev:weapp` 构建产物 （Debug)
- `yarn build:weapp` 构建产物 (Production)

> 构建的产物在根目录的`dist`下，打开小程序开发工具，导入到这个目录下就能运行

-----------------------------

### 目录结构

| 目录      | 职责          |
|:--------|:------------|
| `pages` | 页面          |
| `specs` | 规范          |
| `store` | 状态管理        |
| `ui`    | 全局ui组件      |
| `utils` | 全局工具类 |

-------------------


