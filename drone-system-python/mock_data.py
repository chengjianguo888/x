"""模拟数据 - 对应 mockData.ts"""

import math
from datetime import datetime, timedelta, timezone

from models import (
    Alert,
    Drone,
    DroneLocation,
    FlightData,
    MaintenanceRecord,
    Mission,
    MissionWeather,
    Report,
    User,
)

# ── 用户 ──────────────────────────────────────────────

mock_users: list[User] = [
    User(id='u1', username='admin', name='张伟', role='admin',
         email='admin@drone.com', phone='138****8888',
         department='系统管理部', status='active',
         last_login='2026-03-08 09:15:23', created_at='2025-01-01'),
    User(id='u2', username='operator1', name='李明', role='operator',
         email='liming@drone.com', phone='139****6666',
         department='飞行作业部', status='active',
         last_login='2026-03-08 08:30:10', created_at='2025-02-15'),
    User(id='u3', username='operator2', name='王芳', role='operator',
         email='wangfang@drone.com', phone='137****5555',
         department='飞行作业部', status='active',
         last_login='2026-03-07 17:45:32', created_at='2025-02-20'),
    User(id='u4', username='viewer1', name='刘洋', role='viewer',
         email='liuyang@drone.com', phone='136****4444',
         department='数据分析部', status='active',
         last_login='2026-03-08 10:00:00', created_at='2025-03-01'),
    User(id='u5', username='operator3', name='陈晓', role='operator',
         email='chenxiao@drone.com', phone='135****3333',
         department='飞行作业部', status='inactive',
         last_login='2026-02-28 16:20:45', created_at='2025-03-10'),
]

# ── 无人机 ────────────────────────────────────────────

mock_drones: list[Drone] = [
    Drone(id='d1', name='天鹰-01', model='DJI Mavic 3 Pro',
          serial_number='DJI-M3P-001', status='flying',
          battery_level=78, total_flight_hours=342.5, total_flights=892,
          location=DroneLocation(lat=39.9042, lng=116.4074, altitude=120),
          speed=15, assigned_pilot='李明', last_mission='城市巡检-北区',
          purchase_date='2025-03-15', next_maintenance_date='2026-03-20',
          max_payload=0.8, max_speed=68, max_range=28000, max_altitude=6000,
          cameras=['4/3 CMOS 20MP', 'Telephoto 70mm'],
          sensors=['GPS', 'IMU', '障碍感知']),
    Drone(id='d2', name='天鹰-02', model='DJI Phantom 4 RTK',
          serial_number='DJI-P4R-002', status='idle',
          battery_level=100, total_flight_hours=215.8, total_flights=523,
          location=DroneLocation(lat=39.9155, lng=116.3983, altitude=0),
          speed=0, assigned_pilot='王芳', last_mission='土地测绘-东郊',
          purchase_date='2025-05-20', next_maintenance_date='2026-04-15',
          max_payload=1.2, max_speed=72, max_range=30000, max_altitude=6000,
          cameras=['1" CMOS 20MP RTK'],
          sensors=['RTK GPS', 'IMU', '多余度传感器']),
    Drone(id='d3', name='农鹰-01', model='DJI Agras T40',
          serial_number='DJI-T40-003', status='charging',
          battery_level=45, total_flight_hours=128.3, total_flights=312,
          purchase_date='2025-07-10', next_maintenance_date='2026-03-25',
          max_payload=40, max_speed=36, max_range=8000, max_altitude=5000,
          sensors=['雷达感知', 'GNSS', '液位传感器']),
    Drone(id='d4', name='天鹰-03', model='Autel EVO II Pro',
          serial_number='AUT-E2P-004', status='maintenance',
          battery_level=0, total_flight_hours=189.2, total_flights=445,
          purchase_date='2025-04-08', next_maintenance_date='2026-03-08',
          max_payload=0.9, max_speed=70, max_range=25000, max_altitude=7000,
          cameras=['1" CMOS 6K'], sensors=['GPS', 'IMU', '视觉感知']),
    Drone(id='d5', name='侦察鹰-01', model='Skydio 2+',
          serial_number='SKD-2P-005', status='flying',
          battery_level=62, total_flight_hours=95.7, total_flights=234,
          location=DroneLocation(lat=39.8913, lng=116.3941, altitude=80),
          speed=12, assigned_pilot='李明', last_mission='安全巡逻-南区',
          purchase_date='2025-09-01', next_maintenance_date='2026-05-01',
          max_payload=0.4, max_speed=58, max_range=10000, max_altitude=4572,
          cameras=['12MP 360度'], sensors=['GPS', '360度视觉感知']),
    Drone(id='d6', name='天鹰-04', model='Parrot Anafi USA',
          serial_number='PAR-AUS-006', status='offline',
          battery_level=30, total_flight_hours=67.4, total_flights=189,
          purchase_date='2025-10-15', next_maintenance_date='2026-06-15',
          max_payload=0.3, max_speed=55, max_range=7000, max_altitude=4000,
          cameras=['32x变焦', '热成像'], sensors=['GPS', 'GNSS']),
]

# ── 任务 ──────────────────────────────────────────────

mock_missions: list[Mission] = [
    Mission(id='m1', name='城市基础设施巡检-北区', type='inspection',
            status='in_progress', drone_id='d1', drone_name='天鹰-01',
            pilot_id='u2', pilot_name='李明',
            start_time='2026-03-08 09:00:00', planned_duration=120,
            progress=65, area='北京市朝阳区北部',
            description='对北区电力线路、桥梁等基础设施进行定期巡检',
            waypoints=24, coverage_area=15.6, data_collected=2.3,
            weather=MissionWeather(temperature=12, wind_speed=8, humidity=45, visibility='良好'),
            priority='high'),
    Mission(id='m2', name='农田航测-东郊示范区', type='mapping',
            status='completed', drone_id='d2', drone_name='天鹰-02',
            pilot_id='u3', pilot_name='王芳',
            start_time='2026-03-08 07:30:00', end_time='2026-03-08 09:15:00',
            planned_duration=90, actual_duration=105, progress=100,
            area='北京东郊农业示范区',
            description='高精度航测建图，生成正射影像和DEM数字高程模型',
            waypoints=56, coverage_area=42.8, data_collected=8.7,
            weather=MissionWeather(temperature=10, wind_speed=5, humidity=50, visibility='优秀'),
            priority='medium'),
    Mission(id='m3', name='大型农场精准喷洒', type='agriculture',
            status='planned', drone_id='d3', drone_name='农鹰-01',
            pilot_id='u2', pilot_name='李明',
            start_time='2026-03-08 14:00:00', planned_duration=180,
            progress=0, area='京郊大型农场A区',
            description='对小麦进行精准农药喷洒作业',
            waypoints=88, coverage_area=120.5, priority='high'),
    Mission(id='m4', name='安全巡逻-南区工业园', type='surveillance',
            status='in_progress', drone_id='d5', drone_name='侦察鹰-01',
            pilot_id='u2', pilot_name='李明',
            start_time='2026-03-08 10:30:00', planned_duration=60,
            progress=40, area='南区工业园',
            description='例行安全巡逻，监控重要区域',
            waypoints=12, coverage_area=8.2, data_collected=1.1,
            priority='critical'),
    Mission(id='m5', name='山区搜救演练', type='search_rescue',
            status='completed', drone_id='d1', drone_name='天鹰-01',
            pilot_id='u3', pilot_name='王芳',
            start_time='2026-03-07 14:00:00', end_time='2026-03-07 16:30:00',
            planned_duration=150, actual_duration=147, progress=100,
            area='北京西山',
            description='山区搜救演练，测试无人机搜救能力',
            waypoints=35, coverage_area=25.0, data_collected=4.5,
            priority='critical'),
    Mission(id='m6', name='城市3D建模-CBD区', type='mapping',
            status='planned', drone_id='d2', drone_name='天鹰-02',
            pilot_id='u3', pilot_name='王芳',
            start_time='2026-03-09 09:00:00', planned_duration=240,
            progress=0, area='北京CBD核心区',
            description='对CBD核心区进行三维建模数据采集',
            waypoints=120, coverage_area=6.8, priority='medium'),
]

# ── 飞行数据 ──────────────────────────────────────────

_now = datetime.now(tz=timezone.utc)
mock_flight_data: list[FlightData] = [
    FlightData(
        id=f'fd{i + 1}',
        mission_id='m1',
        mission_name='城市基础设施巡检-北区',
        drone_id='d1',
        timestamp=(_now - timedelta(minutes=50 - i)).isoformat(),
        altitude=round(100 + math.sin(i * 0.3) * 20, 1),
        speed=round(12 + math.sin(i * 0.5) * 5, 1),
        battery=round(90 - i * 0.4, 1),
        latitude=round(39.9042 + i * 0.001, 4),
        longitude=round(116.4074 + i * 0.001, 4),
        heading=round((i * 15) % 360, 1),
        pitch=round(math.sin(i * 0.2) * 5, 1),
        roll=round(math.sin(i * 0.3) * 3, 1),
        temperature=round(12 + math.sin(i * 0.1) * 2, 1),
        humidity=round(45 + math.sin(i * 0.2) * 5, 1),
        pressure=round(1013.25 - i * 0.1, 2),
        signal_strength=round(85 + math.sin(i * 0.4) * 10, 1),
        gps_accuracy=round(0.8 + (i % 5) * 0.1, 1),
        images_captured=int(i * 2.3),
        data_size=round(i * 48.5, 1),
    )
    for i in range(50)
]

# ── 告警 ──────────────────────────────────────────────

mock_alerts: list[Alert] = [
    Alert(id='a1', type='warning', title='电池电量低',
          message='天鹰-03 电池电量降至45%，请及时安排充电',
          timestamp='2026-03-08 10:45:00', drone_id='d3',
          resolved=False, priority='medium'),
    Alert(id='a2', type='error', title='设备离线',
          message='天鹰-04 已离线，请检查设备状态',
          timestamp='2026-03-08 09:30:00', drone_id='d6',
          resolved=False, priority='high'),
    Alert(id='a3', type='warning', title='维护到期提醒',
          message='天鹰-03 定期维护即将到期(2026-03-25)，请及时安排',
          timestamp='2026-03-08 08:00:00', drone_id='d3',
          resolved=False, priority='medium'),
    Alert(id='a4', type='info', title='任务完成',
          message='农田航测-东郊示范区 任务已成功完成，数据已上传',
          timestamp='2026-03-08 09:15:00', mission_id='m2',
          resolved=True, priority='low'),
    Alert(id='a5', type='warning', title='风速超限警告',
          message='天鹰-01 所在区域风速达到8m/s，接近安全上限',
          timestamp='2026-03-08 10:20:00', drone_id='d1', mission_id='m1',
          resolved=False, priority='high'),
    Alert(id='a6', type='success', title='充电完成',
          message='天鹰-02 充电已完成，电量100%，可随时出发',
          timestamp='2026-03-08 07:00:00', drone_id='d2',
          resolved=True, priority='low'),
    Alert(id='a7', type='error', title='GPS信号弱',
          message='侦察鹰-01 GPS信号强度下降，请检查作业区域',
          timestamp='2026-03-08 11:05:00', drone_id='d5', mission_id='m4',
          resolved=False, priority='critical'),
]

# ── 报告 ──────────────────────────────────────────────

mock_reports: list[Report] = [
    Report(id='r1', name='2026年3月第一周飞行报告', type='mission',
           status='ready', created_at='2026-03-08 08:00:00',
           created_by='张伟', size='2.3 MB',
           period='2026-03-01 ~ 2026-03-07',
           mission_count=18, flight_hours=34.5),
    Report(id='r2', name='无人机机队状态月报', type='fleet',
           status='ready', created_at='2026-03-01 09:00:00',
           created_by='张伟', size='1.8 MB', period='2026年2月',
           mission_count=67, flight_hours=128.3),
    Report(id='r3', name='设备维护记录汇总', type='maintenance',
           status='ready', created_at='2026-02-28 17:00:00',
           created_by='李明', size='856 KB', period='2026年2月'),
    Report(id='r4', name='飞行性能分析报告', type='performance',
           status='generating', created_at='2026-03-08 11:00:00',
           created_by='张伟'),
    Report(id='r5', name='2026年2月综合月报', type='monthly',
           status='ready', created_at='2026-03-01 08:00:00',
           created_by='张伟', size='5.2 MB', period='2026年2月',
           mission_count=67, flight_hours=128.3),
]

# ── 维护记录 ──────────────────────────────────────────

mock_maintenance_records: list[MaintenanceRecord] = [
    MaintenanceRecord(id='mr1', drone_id='d4', drone_name='天鹰-03',
                      type='repair', status='in_progress',
                      scheduled_date='2026-03-08', technician='赵工',
                      description='电机磨损维修，云台校准', cost=1200,
                      parts=['电机x2', '螺旋桨x4']),
    MaintenanceRecord(id='mr2', drone_id='d3', drone_name='农鹰-01',
                      type='routine', status='scheduled',
                      scheduled_date='2026-03-25',
                      description='例行保养，润滑喷洒泵，校准传感器', cost=500),
    MaintenanceRecord(id='mr3', drone_id='d1', drone_name='天鹰-01',
                      type='inspection', status='completed',
                      scheduled_date='2026-02-15', completed_date='2026-02-15',
                      technician='王工',
                      description='飞行前检查，确认所有系统正常', cost=200),
    MaintenanceRecord(id='mr4', drone_id='d2', drone_name='天鹰-02',
                      type='upgrade', status='scheduled',
                      scheduled_date='2026-04-01',
                      description='固件升级至最新版本，提升RTK精度', cost=0),
]

# ── 图表数据 ──────────────────────────────────────────

flight_trend_data = [
    {'date': '03-01', 'flights': 8,  'hours': 18.5, 'dataGB': 12.3},
    {'date': '03-02', 'flights': 12, 'hours': 24.2, 'dataGB': 18.7},
    {'date': '03-03', 'flights': 6,  'hours': 15.8, 'dataGB': 9.2},
    {'date': '03-04', 'flights': 15, 'hours': 32.1, 'dataGB': 24.5},
    {'date': '03-05', 'flights': 10, 'hours': 22.4, 'dataGB': 15.8},
    {'date': '03-06', 'flights': 9,  'hours': 19.6, 'dataGB': 14.1},
    {'date': '03-07', 'flights': 13, 'hours': 28.3, 'dataGB': 20.6},
    {'date': '03-08', 'flights': 7,  'hours': 14.2, 'dataGB': 11.3},
]

mission_type_data = [
    {'name': '巡检', 'value': 35, 'color': '#00d4ff'},
    {'name': '测绘', 'value': 25, 'color': '#00ff88'},
    {'name': '农业', 'value': 20, 'color': '#ffaa00'},
    {'name': '监控', 'value': 12, 'color': '#a78bfa'},
    {'name': '搜救', 'value': 8,  'color': '#ff6b6b'},
]

drone_performance_data = [
    {'name': '天鹰-01',  'flights': 45, 'hours': 92.3, 'efficiency': 96},
    {'name': '天鹰-02',  'flights': 38, 'hours': 78.5, 'efficiency': 94},
    {'name': '农鹰-01',  'flights': 28, 'hours': 56.2, 'efficiency': 89},
    {'name': '天鹰-03',  'flights': 30, 'hours': 61.8, 'efficiency': 82},
    {'name': '侦察鹰-01', 'flights': 22, 'hours': 45.1, 'efficiency': 91},
]
