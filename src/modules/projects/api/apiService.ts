import axios from 'axios'
import type { Employee, EmployeeId, Project, ProjectId, Task } from '@/types'

const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_PROJECT_URL,
})

// Consume API Empleados
export const fetchAllEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await apiService.get('/Empleado')
    return response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

export const fetchEmployeeById = async (id: EmployeeId): Promise<Employee> => {
  try {
    const response = await apiService.get(`/Empleado/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching employee:', error)
    throw error
  }
}

export const createEmployee = async (employee: Employee): Promise<Employee> => {
  try {
    const response = await apiService.post('/Empleado', employee)
    return response.data
  } catch (error) {
    console.error('Error creating employee:', error)
    throw error
  }
}

export const updateEmployee = async (id: EmployeeId, employee: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await apiService.put(`/Empleado/${id}`, employee)
    return response.data
  } catch (error) {
    console.error('Error updating employee:', error)
    throw error
  }
}

export const deleteEmployee = async (id: EmployeeId): Promise<void> => {
  try {
    await apiService.delete(`/Empleado/${id}`)
  } catch (error) {
    console.error('Error deleting employee:', error)
    throw error
  }
}

// Consume API Project
export const fetchAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await apiService.get('/Project')
    return response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

export const createProject = async (project: Project): Promise<Project> => {
  try {
    const response = await apiService.post('/Project', project)
    return response.data
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export const updateProject = async (id: ProjectId, project: Partial<Project>): Promise<Project> => {
  try {
    const response = await apiService.put(`/Project/${id}`, project)
    return response.data
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export const deleteProject = async (id: ProjectId): Promise<void> => {
  try {
    await apiService.delete(`/Project/${id}`)
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

// Consume API Tasks into Project
export const fetchAllTasks = async (projectId: ProjectId): Promise<Project['tareas']> => {
  try {
    const response = await apiService.get(`/Project/${projectId}/tasks`)
    return response.data
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}

export const createTask = async (projectId: ProjectId, task: Task): Promise<Task> => {
  try {
    const response = await apiService.post(`/Project/${projectId}/tasks`, task)
    return response.data
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

export const updateTask = async (projectId: ProjectId, taskId: string, task: Partial<Task>): Promise<Task> => {
  try {
    const response = await apiService.put(`/Project/${projectId}/tasks/${taskId}`, task)
    return response.data
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

export const deleteTask = async (projectId: ProjectId, taskId: string): Promise<void> => {
  try {
    await apiService.delete(`/Project/${projectId}/tasks/${taskId}`)
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}
