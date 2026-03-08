"""数据模型定义 - 对应 TypeScript 接口"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class User:
    id: str
    username: str
    name: str
    role: str          # 'admin' | 'operator' | 'viewer'
    email: str
    status: str        # 'active' | 'inactive'
    created_at: str
    avatar: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    last_login: Optional[str] = None


@dataclass
class DroneLocation:
    lat: float
    lng: float
    altitude: float


@dataclass
class Drone:
    id: str
    name: str
    model: str
    serial_number: str
    status: str        # 'idle' | 'flying' | 'charging' | 'maintenance' | 'offline'
    battery_level: int
    total_flight_hours: float
    total_flights: int
    purchase_date: str
    next_maintenance_date: str
    max_payload: float
    max_speed: int
    max_range: int
    max_altitude: int
    location: Optional[DroneLocation] = None
    speed: Optional[float] = None
    assigned_pilot: Optional[str] = None
    last_mission: Optional[str] = None
    cameras: list = field(default_factory=list)
    sensors: list = field(default_factory=list)


@dataclass
class MissionWeather:
    temperature: float
    wind_speed: float
    humidity: float
    visibility: str


@dataclass
class Mission:
    id: str
    name: str
    type: str          # 'inspection' | 'mapping' | 'delivery' | 'surveillance' | 'agriculture' | 'search_rescue'
    status: str        # 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'paused'
    drone_id: str
    drone_name: str
    pilot_id: str
    pilot_name: str
    start_time: str
    planned_duration: int
    description: str
    priority: str      # 'low' | 'medium' | 'high' | 'critical'
    end_time: Optional[str] = None
    actual_duration: Optional[int] = None
    area: Optional[str] = None
    waypoints: Optional[int] = None
    coverage_area: Optional[float] = None
    data_collected: Optional[float] = None
    weather: Optional[MissionWeather] = None
    progress: Optional[int] = 0


@dataclass
class FlightData:
    id: str
    mission_id: str
    mission_name: str
    drone_id: str
    timestamp: str
    altitude: float
    speed: float
    battery: float
    latitude: float
    longitude: float
    heading: float
    pitch: float
    roll: float
    temperature: float
    humidity: float
    pressure: float
    signal_strength: float
    gps_accuracy: float
    drone_name: Optional[str] = None
    images_captured: Optional[int] = None
    data_size: Optional[float] = None


@dataclass
class Alert:
    id: str
    type: str          # 'warning' | 'error' | 'info' | 'success'
    title: str
    message: str
    timestamp: str
    resolved: bool
    priority: str      # 'low' | 'medium' | 'high' | 'critical'
    drone_id: Optional[str] = None
    mission_id: Optional[str] = None


@dataclass
class Report:
    id: str
    name: str
    type: str          # 'mission' | 'fleet' | 'maintenance' | 'performance' | 'monthly'
    status: str        # 'generating' | 'ready' | 'failed'
    created_at: str
    created_by: str
    size: Optional[str] = None
    period: Optional[str] = None
    mission_count: Optional[int] = None
    flight_hours: Optional[float] = None


@dataclass
class MaintenanceRecord:
    id: str
    drone_id: str
    drone_name: str
    type: str          # 'routine' | 'repair' | 'upgrade' | 'inspection'
    status: str        # 'scheduled' | 'in_progress' | 'completed' | 'overdue'
    scheduled_date: str
    description: str
    completed_date: Optional[str] = None
    technician: Optional[str] = None
    cost: Optional[float] = None
    parts: list = field(default_factory=list)
    notes: Optional[str] = None
