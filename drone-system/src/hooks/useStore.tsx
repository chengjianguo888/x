import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Drone, Mission, MaintenanceRecord, Alert, User } from '../types';
import {
  mockDrones as initDrones,
  mockMissions as initMissions,
  mockMaintenanceRecords as initMaintenance,
  mockAlerts as initAlerts,
  mockUsers as initUsers,
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface StoreContextType {
  drones: Drone[];
  missions: Mission[];
  maintenanceRecords: MaintenanceRecord[];
  alerts: Alert[];
  users: User[];
  toasts: Toast[];
  // Drone actions
  updateDroneStatus: (id: string, status: Drone['status']) => void;
  addDrone: (drone: Drone) => void;
  // Mission actions
  updateMissionStatus: (id: string, status: Mission['status']) => void;
  addMission: (mission: Mission) => void;
  // Maintenance actions
  updateMaintenanceStatus: (id: string, status: MaintenanceRecord['status']) => void;
  addMaintenance: (record: MaintenanceRecord) => void;
  // Alert actions
  resolveAlert: (id: string) => void;
  // User actions
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  // Toast actions
  showToast: (type: Toast['type'], message: string) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [drones, setDrones] = useState<Drone[]>(initDrones);
  const [missions, setMissions] = useState<Mission[]>(initMissions);
  const [maintenanceRecords, setMaintenance] = useState<MaintenanceRecord[]>(initMaintenance);
  const [alerts, setAlerts] = useState<Alert[]>(initAlerts);
  const [users, setUsers] = useState<User[]>(initUsers);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateDroneStatus = useCallback((id: string, status: Drone['status']) => {
    setDrones(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  }, []);

  const addDrone = useCallback((drone: Drone) => {
    setDrones(prev => [...prev, drone]);
  }, []);

  const updateMissionStatus = useCallback((id: string, status: Mission['status']) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  }, []);

  const addMission = useCallback((mission: Mission) => {
    setMissions(prev => [...prev, mission]);
  }, []);

  const updateMaintenanceStatus = useCallback((id: string, status: MaintenanceRecord['status']) => {
    setMaintenance(prev => prev.map(r => r.id === id ? { ...r, status, completedDate: status === 'completed' ? new Date().toISOString().slice(0, 10) : r.completedDate } : r));
  }, []);

  const addMaintenance = useCallback((record: MaintenanceRecord) => {
    setMaintenance(prev => [...prev, record]);
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  }, []);

  const addUser = useCallback((user: User) => {
    setUsers(prev => [...prev, user]);
  }, []);

  const updateUser = useCallback((user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  return (
    <StoreContext.Provider value={{
      drones, missions, maintenanceRecords, alerts, users, toasts,
      updateDroneStatus, addDrone,
      updateMissionStatus, addMission,
      updateMaintenanceStatus, addMaintenance,
      resolveAlert,
      addUser, updateUser, deleteUser,
      showToast, dismissToast,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
