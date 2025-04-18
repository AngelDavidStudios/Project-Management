import axios from 'axios'
import type { Employee, EmployeeId, Project, ProjectId } from '@/types'

const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_PROJECT_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
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
