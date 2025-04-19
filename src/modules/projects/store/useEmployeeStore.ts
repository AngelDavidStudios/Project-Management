import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Employee, EmployeeId } from '@/types'
import {
  createEmployee,
  fetchAllEmployees,
  updateEmployee,
  deleteEmployee,
  fetchEmployeeById
} from '@/modules/projects/api/apiService.ts'


export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentEmployee = ref<Employee | null>(null)

  const showDeleteModal = ref(false);
  const employeeToDelete = ref<string | null>(null);

  // Get all employees
  const fetchEmployees = async () => {
    isLoading.value = true
    error.value = null
    try {
      employees.value = await fetchAllEmployees()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar empleados'
      console.error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  // Get employee by ID
  const fetchEmployeeByIdAsync = async (id: EmployeeId) => {
    isLoading.value = true
    error.value = null
    try {
      currentEmployee.value = await fetchEmployeeById(id)
      return currentEmployee.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar el empleado'
      console.error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  // Create a new employee
  const addEmployeeAsync = async (employee: Employee) => {
    isLoading.value = true
    error.value = null
    try {
      const newEmployee = await createEmployee(employee)
      employees.value.push(newEmployee)
      return newEmployee
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear el empleado'
      console.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update an existing employee
  const updateEmployeeAsync = async (id: EmployeeId, employee: Partial<Employee>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedEmployee = await updateEmployee(id, employee)
      const index = employees.value.findIndex(emp => emp.id === id)
      if (index !== -1) {
        employees.value[index] = updatedEmployee
      }
      return updatedEmployee
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar el empleado'
      console.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete an employee
  const deleteEmployeeAsync = async (id: EmployeeId) => {
    isLoading.value = true
    error.value = null
    try {
      await deleteEmployee(id)
      employees.value = employees.value.filter(emp => emp.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar el empleado'
      console.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const confirmDelete = (id: string) => {
    employeeToDelete.value = id;
    showDeleteModal.value = true;
  };

  const cancelDelete = () => {
    employeeToDelete.value = null;
    showDeleteModal.value = false;
  };

  // Computed properties
  const getEmployeeById = computed(() => {
    return (id: string) => employees.value.find(emp => emp.id === id);
  });

  const getEmployeesByProject = computed(() => {
    return (projectId: string) => employees.value.filter(emp =>
      emp.proyectosAsignados.includes(projectId)
    );
  });
  return {
    employees,
    isLoading,
    error,
    currentEmployee,
    showDeleteModal,
    employeeToDelete,
    fetchEmployees,
    fetchEmployeeByIdAsync,
    addEmployeeAsync,
    updateEmployeeAsync,
    deleteEmployeeAsync,
    confirmDelete,
    cancelDelete,
    getEmployeeById,
    getEmployeesByProject
  }
})
