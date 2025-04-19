export interface Task {
  id: string;
  titulo: string;
  descripcion: string;
  fechaAsignada: string;
  fechaLimite: string;
  estado: number; // 0: Pendiente, 1: En progreso, 2: Completada, 3: Retrasada
}

export type TaskId = Task['id'];

export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  empleadosAsignados: string[];
  tareas: Task[];
}

export type ProjectId = Project['id'];

export interface Employee {
  id: string;
  nombre: string;
  correo: string;
  proyectosAsignados: string[]
}

export type EmployeeId = Employee['id'];

export interface DateRange {
  startDate: string;
  endDate: string;
}
