# 无人机作业管理系统 — Python 版

基于 Python Flask 的无人机作业管理 Web 应用，功能与 React 版完全对应。

## 环境要求

- Python >= 3.10

## 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 启动应用
python app.py

# 启动开发模式（启用调试和自动重载）
FLASK_DEBUG=1 python app.py
```

启动后在浏览器打开 http://localhost:5000。

## 登录账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `admin` | `admin123` | 管理员（admin） |
| `operator1` | `password` | 操作员（operator） |
| `operator2` | `password` | 操作员（operator） |
| `viewer1` | `password` | 观察者（viewer） |

> 注意：`operator3` 账号状态为 `inactive`，无法登录。

## 项目结构

```
drone-system-python/
├── app.py                  # Flask 应用（路由、认证、API）
├── models.py               # 数据模型（dataclass）
├── mock_data.py            # 模拟数据
├── requirements.txt        # Python 依赖
├── static/
│   ├── style.css           # Tailwind CSS（预编译）
│   └── chart.js            # Chart.js 图表库
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

- **数据概览** (`/`) — 飞行统计、趋势图表、机队健康评分
- **实时监控** (`/monitor`) — 飞行中无人机的遥测数据与姿态显示
- **任务管理** (`/missions`) — 创建与管理巡检、测绘、配送等飞行任务
- **机队管理** (`/drones`) — 查看和管理无人机状态、电量、位置
- **数据分析** (`/data`) — 飞行数据（高度、速度、电量）可视化
- **维护记录** (`/maintenance`) — 例行维护、维修、升级、巡检记录
- **报告中心** (`/reports`) — 生成任务、机队、维护等报告
- **用户管理** (`/users`) — 管理用户账号与角色权限（仅管理员）
- **系统设置** (`/settings`) — 通知、安全、网络等系统配置

## 技术栈

- **Flask** — Web 框架
- **Jinja2** — 模板引擎（Flask 内置）
- **Tailwind CSS** — 样式（预编译 CSS）
- **Chart.js** — 图表
