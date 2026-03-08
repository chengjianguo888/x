# 无人机作业管理系统 (UAV OPS)

无人机作业管理系统，提供机队管理、飞行任务调度、实时监控、数据采集分析、维护记录跟踪等功能。

本仓库包含两个版本：

| 版本 | 目录 | 技术栈 | 说明 |
|------|------|--------|------|
| **Python 版（推荐）** | `drone-system-python/` | Python + Flask | 只需安装 Python，运行简单 |
| React 版 | `drone-system/` | React + TypeScript + Vite | 需要 Node.js 环境 |

---

## Python 版 — 快速开始

### 环境要求

- [Python](https://www.python.org/downloads/) >= 3.10
- 浏览器需联网（自动加载中文字体和样式，无乱码）

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/chengjianguo888/x.git
cd x

# 2. 进入 Python 版目录
cd drone-system-python

# 3. 安装依赖（只需一次）
pip install -r requirements.txt

# 4. 启动
python app.py
```

启动后在浏览器打开 **http://localhost:5000** 即可直接使用。

> **关于中文显示：** 系统通过 Google Fonts 自动加载中文字体，确保无乱码。浏览器需能联网。

### 登录账号

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| `admin` | `admin123` | 管理员 | 拥有全部权限 |
| `operator1` | `password` | 操作员 | 飞行作业人员 |
| `operator2` | `password` | 操作员 | 飞行作业人员 |
| `viewer1` | `password` | 观察者 | 仅查看数据 |

---

## React 版 — 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9（随 Node.js 一起安装）

### 安装与运行

```bash
cd drone-system
npm install
npm run dev
```

启动后在浏览器打开终端提示的地址（默认 http://localhost:5173），登录账号同上。

---

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

详细说明请参阅各版本目录下的 README：
- [Python 版开发指南](./drone-system-python/README.md)
- [React 版开发指南](./drone-system/README.md)