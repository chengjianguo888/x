# 无人机作业管理系统 — 开发指南

基于 React + TypeScript + Vite 的无人机作业管理前端项目。

## 环境要求

- Node.js >= 18
- npm >= 9

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器（支持热更新）
npm run dev

# 代码检查
npm run lint

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
drone-system/
├── src/
│   ├── main.tsx              # 应用入口
│   ├── App.tsx               # 路由与全局 Provider
│   ├── components/
│   │   ├── Layout.tsx        # 侧边栏 + 顶栏布局
│   │   └── ToastContainer.tsx # 通知提示
│   ├── hooks/
│   │   ├── useAuth.tsx       # 登录认证 Context
│   │   └── useStore.tsx      # 全局状态管理
│   ├── pages/                # 各功能页面
│   ├── types/index.ts        # TypeScript 类型定义
│   └── data/mockData.ts      # 模拟数据
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 登录说明

系统使用模拟数据进行身份验证，支持以下账号：

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `admin` | `admin123` | 管理员（admin） |
| `operator1` | `password` | 操作员（operator） |
| `operator2` | `password` | 操作员（operator） |
| `viewer1` | `password` | 观察者（viewer） |

> 注意：`operator3` 账号状态为 `inactive`，无法登录。

## 功能页面

- **数据概览** (`/`) — 飞行统计、趋势图表、机队健康评分
- **实时监控** (`/monitor`) — 飞行中无人机的遥测数据与姿态显示
- **任务管理** (`/missions`) — 创建与管理巡检、测绘、配送等飞行任务
- **机队管理** (`/drones`) — 查看和管理无人机状态、电量、位置
- **数据分析** (`/data`) — 飞行数据（高度、速度、电量）可视化
- **维护记录** (`/maintenance`) — 例行维护、维修、升级、巡检记录
- **报告中心** (`/reports`) — 生成任务、机队、维护等报告
- **用户管理** (`/users`) — 管理用户账号与角色权限
- **系统设置** (`/settings`) — 通知、安全、网络等系统配置

## ESLint 配置

如需启用类型感知的 lint 规则，可将 ESLint 配置更新为：

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // 或使用更严格的规则：tseslint.configs.strictTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```
