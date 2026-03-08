# 无人机作业管理系统 — Python 版

基于 Python Flask 的无人机作业管理 Web 应用，功能与 React 版完全对应。

**可以直接使用！** 只需 Python 和 Flask，3 步即可运行。

## 环境要求

- **Python >= 3.10**（[下载地址](https://www.python.org/downloads/)）
- 浏览器需联网（加载 Tailwind CSS 和中文字体）

## 快速开始（3 步直接使用）

```bash
# 第 1 步：进入项目目录
cd drone-system-python

# 第 2 步：安装依赖（只需一次）
pip install -r requirements.txt

# 第 3 步：启动！
python app.py
```

启动后在浏览器打开 **http://localhost:5000**，即可看到登录页面。

### 登录账号

| 用户名 | 密码 | 角色 | 权限 |
|--------|------|------|------|
| `admin` | `admin123` | 管理员 | 全部功能 + 用户管理 |
| `operator1` | `password` | 操作员 | 任务管理、机队管理 |
| `operator2` | `password` | 操作员 | 任务管理、机队管理 |
| `viewer1` | `password` | 观察者 | 仅查看数据 |

> 提示：登录页有「快速登录」按钮，点击即可自动填入账号密码。

### 开发模式（自动重载）

```bash
FLASK_DEBUG=1 python app.py
```

## 中文显示说明

系统通过 **Google Fonts CDN** 加载「Noto Sans SC」中文字体，确保中文正常显示、无乱码。

- ✅ **联网使用**：自动加载字体，中文完美显示
- ⚠️ **离线使用**：会降级使用系统自带字体（Windows 下用微软雅黑，macOS 下用苹方字体）

如在你的电脑上看到方块/乱码，请确认浏览器能正常上网。

## 项目结构

```
drone-system-python/
├── app.py                  # Flask 应用（路由、认证、API）
├── models.py               # 数据模型（dataclass）
├── mock_data.py            # 模拟数据
├── requirements.txt        # Python 依赖
├── static/
│   ├── style.css           # Tailwind CSS（离线备用）
│   └── chart.js            # Chart.js 图表库（离线备用）
└── templates/
    ├── base.html           # 基础布局（侧边栏 + 顶栏）
    ├── login.html          # 登录页
    ├── dashboard.html      # 数据概览
    ├── monitor.html        # 实时监控
    ├── missions.html       # 任务管理
    ├── drones.html         # 机队管理
    ├── data.html           # 数据分析
    ├── maintenance.html    # 维护记录
    ├── reports.html        # 报告中心
    ├── users.html          # 用户管理
    └── settings.html       # 系统设置
```

## 功能页面

| 页面 | 路径 | 说明 |
|------|------|------|
| 数据概览 | `/` | 飞行统计、趋势图表、机队健康评分 |
| 实时监控 | `/monitor` | 飞行中无人机的遥测数据与姿态显示 |
| 任务管理 | `/missions` | 创建与管理巡检、测绘、配送等飞行任务 |
| 机队管理 | `/drones` | 查看和管理无人机状态、电量、位置 |
| 数据分析 | `/data` | 飞行数据（高度、速度、电量）可视化 |
| 维护记录 | `/maintenance` | 例行维护、维修、升级、巡检记录 |
| 报告中心 | `/reports` | 生成任务、机队、维护等报告 |
| 用户管理 | `/users` | 管理用户账号与角色权限（仅管理员） |
| 系统设置 | `/settings` | 通知、安全、网络等系统配置 |

## 技术栈

- **Flask** — Web 框架（Python）
- **Jinja2** — 模板引擎（Flask 内置）
- **Tailwind CSS** — 样式（CDN 加载，含自定义主题色）
- **Noto Sans SC** — 中文字体（Google Fonts CDN）
- **Chart.js** — 图表（CDN 加载）
