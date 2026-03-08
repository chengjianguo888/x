# 无人机作业管理系统 (UAV OPS)

一个基于 React + TypeScript + Vite 构建的无人机作业管理系统，提供无人机机队管理、飞行任务调度、实时监控、数据采集分析、维护记录跟踪等功能。

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9（随 Node.js 一起安装）

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/chengjianguo888/x.git
cd x

# 2. 进入项目目录
cd drone-system

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

启动后，在浏览器中打开终端提示的地址（默认为 http://localhost:5173）。

### 登录账号

系统使用模拟数据，可使用以下账号登录：

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| `admin` | `admin123` | 管理员 | 拥有全部权限 |
| `operator1` | `password` | 操作员 | 飞行作业人员 |
| `operator2` | `password` | 操作员 | 飞行作业人员 |
| `viewer1` | `password` | 观察者 | 仅查看数据 |

### 构建生产版本

```bash
cd drone-system
npm run build      # 构建产物输出到 drone-system/dist/
npm run preview    # 本地预览生产版本
```

## 功能模块

| 模块 | 路径 | 说明 |
|------|------|------|
| 数据概览 | `/` | 统计面板、飞行趋势、任务类型分布、机队健康度 |
| 实时监控 | `/monitor` | 无人机遥测数据、姿态仪、罗盘、实时图表 |
| 任务管理 | `/missions` | 创建、编辑、暂停、取消飞行任务 |
| 机队管理 | `/drones` | 无人机状态、电量、位置查看与管理 |
| 数据分析 | `/data` | 飞行数据可视化（高度、速度、电量等） |
| 维护记录 | `/maintenance` | 例行维护、维修、升级、巡检记录管理 |
| 报告中心 | `/reports` | 生成任务、机队、维护、绩效报告 |
| 用户管理 | `/users` | 用户增删改查与角色分配 |
| 系统设置 | `/settings` | 通知、安全、网络、数据保留等配置 |

## 技术栈

- **React 19** — UI 框架
- **TypeScript** — 类型安全
- **Vite** — 构建工具
- **Tailwind CSS** — 样式
- **Recharts** — 图表
- **Lucide React** — 图标
- **React Router DOM** — 路由

详细开发说明请参阅 [drone-system/README.md](./drone-system/README.md)。