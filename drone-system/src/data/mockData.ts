import type { Drone, Mission, FlightData, Alert, Report, MaintenanceRecord, User } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', username: 'admin', name: '张伟', role: 'admin', email: 'admin@drone.com', phone: '138****8888', department: '系统管理部', status: 'active', lastLogin: '2026-03-08 09:15:23', createdAt: '2025-01-01' },
  { id: 'u2', username: 'operator1', name: '李明', role: 'operator', email: 'liming@drone.com', phone: '139****6666', department: '飞行作业部', status: 'active', lastLogin: '2026-03-08 08:30:10', createdAt: '2025-02-15' },
  { id: 'u3', username: 'operator2', name: '王芳', role: 'operator', email: 'wangfang@drone.com', phone: '137****5555', department: '飞行作业部', status: 'active', lastLogin: '2026-03-07 17:45:32', createdAt: '2025-02-20' },
  { id: 'u4', username: 'viewer1', name: '刘洋', role: 'viewer', email: 'liuyang@drone.com', phone: '136****4444', department: '数据分析部', status: 'active', lastLogin: '2026-03-08 10:00:00', createdAt: '2025-03-01' },
  { id: 'u5', username: 'operator3', name: '陈晓', role: 'operator', email: 'chenxiao@drone.com', phone: '135****3333', department: '飞行作业部', status: 'inactive', lastLogin: '2026-02-28 16:20:45', createdAt: '2025-03-10' },
];

export const mockDrones: Drone[] = [
  {
    id: 'd1', name: '天鹰-01', model: 'DJI Mavic 3 Pro', serialNumber: 'DJI-M3P-001', status: 'flying',
    batteryLevel: 78, totalFlightHours: 342.5, totalFlights: 892,
    location: { lat: 39.9042, lng: 116.4074, altitude: 120 }, speed: 15,
    assignedPilot: '李明', lastMission: '城市巡检-北区',
    purchaseDate: '2025-03-15', nextMaintenanceDate: '2026-03-20',
    maxPayload: 0.8, maxSpeed: 68, maxRange: 28000, maxAltitude: 6000,
    cameras: ['4/3 CMOS 20MP', 'Telephoto 70mm'], sensors: ['GPS', 'IMU', '障碍感知']
  },
  {
    id: 'd2', name: '天鹰-02', model: 'DJI Phantom 4 RTK', serialNumber: 'DJI-P4R-002', status: 'idle',
    batteryLevel: 100, totalFlightHours: 215.8, totalFlights: 523,
    location: { lat: 39.9155, lng: 116.3983, altitude: 0 }, speed: 0,
    assignedPilot: '王芳', lastMission: '土地测绘-东郊',
    purchaseDate: '2025-05-20', nextMaintenanceDate: '2026-04-15',
    maxPayload: 1.2, maxSpeed: 72, maxRange: 30000, maxAltitude: 6000,
    cameras: ['1" CMOS 20MP RTK'], sensors: ['RTK GPS', 'IMU', '多余度传感器']
  },
  {
    id: 'd3', name: '农鹰-01', model: 'DJI Agras T40', serialNumber: 'DJI-T40-003', status: 'charging',
    batteryLevel: 45, totalFlightHours: 128.3, totalFlights: 312,
    purchaseDate: '2025-07-10', nextMaintenanceDate: '2026-03-25',
    maxPayload: 40, maxSpeed: 36, maxRange: 8000, maxAltitude: 5000,
    sensors: ['雷达感知', 'GNSS', '液位传感器']
  },
  {
    id: 'd4', name: '天鹰-03', model: 'Autel EVO II Pro', serialNumber: 'AUT-E2P-004', status: 'maintenance',
    batteryLevel: 0, totalFlightHours: 189.2, totalFlights: 445,
    purchaseDate: '2025-04-08', nextMaintenanceDate: '2026-03-08',
    maxPayload: 0.9, maxSpeed: 70, maxRange: 25000, maxAltitude: 7000,
    cameras: ['1" CMOS 6K'], sensors: ['GPS', 'IMU', '视觉感知']
  },
  {
    id: 'd5', name: '侦察鹰-01', model: 'Skydio 2+', serialNumber: 'SKD-2P-005', status: 'flying',
    batteryLevel: 62, totalFlightHours: 95.7, totalFlights: 234,
    location: { lat: 39.8913, lng: 116.3941, altitude: 80 }, speed: 12,
    assignedPilot: '李明', lastMission: '安全巡逻-南区',
    purchaseDate: '2025-09-01', nextMaintenanceDate: '2026-05-01',
    maxPayload: 0.4, maxSpeed: 58, maxRange: 10000, maxAltitude: 4572,
    cameras: ['12MP 360度'], sensors: ['GPS', '360度视觉感知']
  },
  {
    id: 'd6', name: '天鹰-04', model: 'Parrot Anafi USA', serialNumber: 'PAR-AUS-006', status: 'offline',
    batteryLevel: 30, totalFlightHours: 67.4, totalFlights: 189,
    purchaseDate: '2025-10-15', nextMaintenanceDate: '2026-06-15',
    maxPayload: 0.3, maxSpeed: 55, maxRange: 7000, maxAltitude: 4000,
    cameras: ['32x变焦', '热成像'], sensors: ['GPS', 'GNSS']
  },
];

export const mockMissions: Mission[] = [
  {
    id: 'm1', name: '城市基础设施巡检-北区', type: 'inspection', status: 'in_progress',
    droneId: 'd1', droneName: '天鹰-01', pilotId: 'u2', pilotName: '李明',
    startTime: '2026-03-08 09:00:00', plannedDuration: 120, progress: 65,
    area: '北京市朝阳区北部', description: '对北区电力线路、桥梁等基础设施进行定期巡检',
    waypoints: 24, coverageArea: 15.6, dataCollected: 2.3,
    weather: { temperature: 12, windSpeed: 8, humidity: 45, visibility: '良好' },
    priority: 'high'
  },
  {
    id: 'm2', name: '农田航测-东郊示范区', type: 'mapping', status: 'completed',
    droneId: 'd2', droneName: '天鹰-02', pilotId: 'u3', pilotName: '王芳',
    startTime: '2026-03-08 07:30:00', endTime: '2026-03-08 09:15:00',
    plannedDuration: 90, actualDuration: 105, progress: 100,
    area: '北京东郊农业示范区', description: '高精度航测建图，生成正射影像和DEM数字高程模型',
    waypoints: 56, coverageArea: 42.8, dataCollected: 8.7,
    weather: { temperature: 10, windSpeed: 5, humidity: 50, visibility: '优秀' },
    priority: 'medium'
  },
  {
    id: 'm3', name: '大型农场精准喷洒', type: 'agriculture', status: 'planned',
    droneId: 'd3', droneName: '农鹰-01', pilotId: 'u2', pilotName: '李明',
    startTime: '2026-03-08 14:00:00', plannedDuration: 180, progress: 0,
    area: '京郊大型农场A区', description: '对小麦进行精准农药喷洒作业',
    waypoints: 88, coverageArea: 120.5,
    priority: 'high'
  },
  {
    id: 'm4', name: '安全巡逻-南区工业园', type: 'surveillance', status: 'in_progress',
    droneId: 'd5', droneName: '侦察鹰-01', pilotId: 'u2', pilotName: '李明',
    startTime: '2026-03-08 10:30:00', plannedDuration: 60, progress: 40,
    area: '南区工业园', description: '例行安全巡逻，监控重要区域',
    waypoints: 12, coverageArea: 8.2, dataCollected: 1.1,
    priority: 'critical'
  },
  {
    id: 'm5', name: '山区搜救演练', type: 'search_rescue', status: 'completed',
    droneId: 'd1', droneName: '天鹰-01', pilotId: 'u3', pilotName: '王芳',
    startTime: '2026-03-07 14:00:00', endTime: '2026-03-07 16:30:00',
    plannedDuration: 150, actualDuration: 147, progress: 100,
    area: '北京西山', description: '山区搜救演练，测试无人机搜救能力',
    waypoints: 35, coverageArea: 25.0, dataCollected: 4.5,
    priority: 'critical'
  },
  {
    id: 'm6', name: '城市3D建模-CBD区', type: 'mapping', status: 'planned',
    droneId: 'd2', droneName: '天鹰-02', pilotId: 'u3', pilotName: '王芳',
    startTime: '2026-03-09 09:00:00', plannedDuration: 240, progress: 0,
    area: '北京CBD核心区', description: '对CBD核心区进行三维建模数据采集',
    waypoints: 120, coverageArea: 6.8,
    priority: 'medium'
  },
];

export const mockFlightData: FlightData[] = Array.from({ length: 50 }, (_, i) => ({
  id: `fd${i + 1}`,
  missionId: 'm1',
  missionName: '城市基础设施巡检-北区',
  droneId: 'd1',
  timestamp: new Date(Date.now() - (50 - i) * 60000).toISOString(),
  altitude: 100 + Math.sin(i * 0.3) * 20,
  speed: 12 + Math.sin(i * 0.5) * 5,
  battery: 90 - i * 0.4,
  latitude: 39.9042 + i * 0.001,
  longitude: 116.4074 + i * 0.001,
  heading: (i * 15) % 360,
  pitch: Math.sin(i * 0.2) * 5,
  roll: Math.sin(i * 0.3) * 3,
  temperature: 12 + Math.sin(i * 0.1) * 2,
  humidity: 45 + Math.sin(i * 0.2) * 5,
  pressure: 1013.25 - i * 0.1,
  signalStrength: 85 + Math.sin(i * 0.4) * 10,
  gpsAccuracy: 0.8 + Math.random() * 0.4,
  imagesCaptured: Math.floor(i * 2.3),
  dataSize: i * 48.5,
}));

export const mockAlerts: Alert[] = [
  { id: 'a1', type: 'warning', title: '电池电量低', message: '天鹰-03 电池电量降至45%，请及时安排充电', timestamp: '2026-03-08 10:45:00', droneId: 'd3', resolved: false, priority: 'medium' },
  { id: 'a2', type: 'error', title: '设备离线', message: '天鹰-04 已离线，请检查设备状态', timestamp: '2026-03-08 09:30:00', droneId: 'd6', resolved: false, priority: 'high' },
  { id: 'a3', type: 'warning', title: '维护到期提醒', message: '天鹰-03 定期维护即将到期(2026-03-25)，请及时安排', timestamp: '2026-03-08 08:00:00', droneId: 'd3', resolved: false, priority: 'medium' },
  { id: 'a4', type: 'info', title: '任务完成', message: '农田航测-东郊示范区 任务已成功完成，数据已上传', timestamp: '2026-03-08 09:15:00', missionId: 'm2', resolved: true, priority: 'low' },
  { id: 'a5', type: 'warning', title: '风速超限警告', message: '天鹰-01 所在区域风速达到8m/s，接近安全上限', timestamp: '2026-03-08 10:20:00', droneId: 'd1', missionId: 'm1', resolved: false, priority: 'high' },
  { id: 'a6', type: 'success', title: '充电完成', message: '天鹰-02 充电已完成，电量100%，可随时出发', timestamp: '2026-03-08 07:00:00', droneId: 'd2', resolved: true, priority: 'low' },
  { id: 'a7', type: 'error', title: 'GPS信号弱', message: '侦察鹰-01 GPS信号强度下降，请检查作业区域', timestamp: '2026-03-08 11:05:00', droneId: 'd5', missionId: 'm4', resolved: false, priority: 'critical' },
];

export const mockReports: Report[] = [
  { id: 'r1', name: '2026年3月第一周飞行报告', type: 'mission', status: 'ready', createdAt: '2026-03-08 08:00:00', createdBy: '张伟', size: '2.3 MB', period: '2026-03-01 ~ 2026-03-07', missionCount: 18, flightHours: 34.5 },
  { id: 'r2', name: '无人机机队状态月报', type: 'fleet', status: 'ready', createdAt: '2026-03-01 09:00:00', createdBy: '张伟', size: '1.8 MB', period: '2026年2月', missionCount: 67, flightHours: 128.3 },
  { id: 'r3', name: '设备维护记录汇总', type: 'maintenance', status: 'ready', createdAt: '2026-02-28 17:00:00', createdBy: '李明', size: '856 KB', period: '2026年2月' },
  { id: 'r4', name: '飞行性能分析报告', type: 'performance', status: 'generating', createdAt: '2026-03-08 11:00:00', createdBy: '张伟' },
  { id: 'r5', name: '2026年2月综合月报', type: 'monthly', status: 'ready', createdAt: '2026-03-01 08:00:00', createdBy: '张伟', size: '5.2 MB', period: '2026年2月', missionCount: 67, flightHours: 128.3 },
];

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  { id: 'mr1', droneId: 'd4', droneName: '天鹰-03', type: 'repair', status: 'in_progress', scheduledDate: '2026-03-08', technician: '赵工', description: '电机磨损维修，云台校准', cost: 1200, parts: ['电机x2', '螺旋桨x4'] },
  { id: 'mr2', droneId: 'd3', droneName: '农鹰-01', type: 'routine', status: 'scheduled', scheduledDate: '2026-03-25', description: '例行保养，润滑喷洒泵，校准传感器', cost: 500 },
  { id: 'mr3', droneId: 'd1', droneName: '天鹰-01', type: 'inspection', status: 'completed', scheduledDate: '2026-02-15', completedDate: '2026-02-15', technician: '王工', description: '飞行前检查，确认所有系统正常', cost: 200 },
  { id: 'mr4', droneId: 'd2', droneName: '天鹰-02', type: 'upgrade', status: 'scheduled', scheduledDate: '2026-04-01', description: '固件升级至最新版本，提升RTK精度', cost: 0 },
];

export const flightTrendData = [
  { date: '03-01', flights: 8, hours: 18.5, dataGB: 12.3 },
  { date: '03-02', flights: 12, hours: 24.2, dataGB: 18.7 },
  { date: '03-03', flights: 6, hours: 15.8, dataGB: 9.2 },
  { date: '03-04', flights: 15, hours: 32.1, dataGB: 24.5 },
  { date: '03-05', flights: 10, hours: 22.4, dataGB: 15.8 },
  { date: '03-06', flights: 9, hours: 19.6, dataGB: 14.1 },
  { date: '03-07', flights: 13, hours: 28.3, dataGB: 20.6 },
  { date: '03-08', flights: 7, hours: 14.2, dataGB: 11.3 },
];

export const missionTypeData = [
  { name: '巡检', value: 35, color: '#00d4ff' },
  { name: '测绘', value: 25, color: '#00ff88' },
  { name: '农业', value: 20, color: '#ffaa00' },
  { name: '监控', value: 12, color: '#a78bfa' },
  { name: '搜救', value: 8, color: '#ff6b6b' },
];

export const dronePerformanceData = [
  { name: '天鹰-01', flights: 45, hours: 92.3, efficiency: 96 },
  { name: '天鹰-02', flights: 38, hours: 78.5, efficiency: 94 },
  { name: '农鹰-01', flights: 28, hours: 56.2, efficiency: 89 },
  { name: '天鹰-03', flights: 30, hours: 61.8, efficiency: 82 },
  { name: '侦察鹰-01', flights: 22, hours: 45.1, efficiency: 91 },
];
