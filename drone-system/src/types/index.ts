export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  avatar?: string;
  email: string;
  phone?: string;
  department?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface Drone {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  status: 'idle' | 'flying' | 'charging' | 'maintenance' | 'offline';
  batteryLevel: number;
  totalFlightHours: number;
  totalFlights: number;
  location?: {
    lat: number;
    lng: number;
    altitude: number;
  };
  speed?: number;
  assignedPilot?: string;
  lastMission?: string;
  purchaseDate: string;
  nextMaintenanceDate: string;
  maxPayload: number;
  maxSpeed: number;
  maxRange: number;
  maxAltitude: number;
  cameras?: string[];
  sensors?: string[];
}

export interface Mission {
  id: string;
  name: string;
  type: 'inspection' | 'mapping' | 'delivery' | 'surveillance' | 'agriculture' | 'search_rescue';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'paused';
  droneId: string;
  droneName: string;
  pilotId: string;
  pilotName: string;
  startTime: string;
  endTime?: string;
  plannedDuration: number;
  actualDuration?: number;
  area?: string;
  description: string;
  waypoints?: number;
  coverageArea?: number;
  dataCollected?: number;
  flightPath?: Array<{ lat: number; lng: number; alt: number }>;
  weather?: {
    temperature: number;
    windSpeed: number;
    humidity: number;
    visibility: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress?: number;
}

export interface FlightData {
  id: string;
  missionId: string;
  missionName: string;
  droneId: string;
  timestamp: string;
  altitude: number;
  speed: number;
  battery: number;
  latitude: number;
  longitude: number;
  heading: number;
  pitch: number;
  roll: number;
  temperature: number;
  humidity: number;
  pressure: number;
  signalStrength: number;
  gpsAccuracy: number;
  imagesCaptured?: number;
  dataSize?: number;
  droneName?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  droneId?: string;
  missionId?: string;
  resolved: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Report {
  id: string;
  name: string;
  type: 'mission' | 'fleet' | 'maintenance' | 'performance' | 'monthly';
  status: 'generating' | 'ready' | 'failed';
  createdAt: string;
  createdBy: string;
  size?: string;
  period?: string;
  missionCount?: number;
  flightHours?: number;
}

export interface MaintenanceRecord {
  id: string;
  droneId: string;
  droneName: string;
  type: 'routine' | 'repair' | 'upgrade' | 'inspection';
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  scheduledDate: string;
  completedDate?: string;
  technician?: string;
  description: string;
  cost?: number;
  parts?: string[];
  notes?: string;
}

export interface DashboardStats {
  totalDrones: number;
  activeDrones: number;
  missionsTodayCompleted: number;
  missionsTodayTotal: number;
  totalFlightHoursToday: number;
  dataCollectedToday: number;
  alertsCount: number;
  fleetHealthScore: number;
}
