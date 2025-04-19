import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { DateRange, Project, ProjectId, Task, TaskId } from '@/types'
import { createProject, deleteProject, fetchAllProjects, updateProject } from '@/modules/projects/api/apiService.ts'
import { calculateDelay, isPastDate } from '@/types/date.ts'


export const useProjectStore = defineStore('projectStore', () => {
  const projects = ref<Project[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentProject = ref<Project | null>(null)
  const dateFilter = ref<DateRange | null>(null)

  // Projects CRUD operations

  // Get all projects
  const fetchProjects = async () => {
    isLoading.value = true
    error.value = null
    try {
      projects.value = await fetchAllProjects()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading projects'
      console.error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  // Create a new project
  const addProjectAsync = async (project: Project) => {
    isLoading.value = true
    error.value = null
    try {
      const newProject = await createProject(project)
      projects.value.push(newProject)
      return newProject
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading projects'
      console.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update an existing project
  const updateProjecyAsync = async (id: string, project: Partial<Project>) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedProject = await updateProject(id, project)
      const index = projects.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        projects.value[index] = { ...projects.value[index], ...updatedProject }
      }
      return updatedProject
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading projects'
      console.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete Project
  const deleteProjectAsync = async  (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await deleteProject(id)
      projects.value = projects.value.filter((p) => p.id !== id)
      if (currentProject.value?.id === id) {
        currentProject.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading projects'
      console.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Tasks CRUD operations

  // Fetch all tasks for a project
  const fetchAllTasks = async (projectId: ProjectId) => {
    isLoading.value = true
    error.value = null
    try {
      const project = projects.value.find((p) => p.id === projectId)
      if (project) {
        return project.tareas
      } else {
        throw new Error('Project not found')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading tasks'
      console.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Add a new task to a project
  const addTaskAsync = async (projectId: ProjectId, task: Omit<Project['tareas'][0], 'id'>) => {
    isLoading.value = true
    error.value = null
    try {
      const project = projects.value.find((p) => p.id === projectId)
      if (project) {
        const newTask = { ...task, id: crypto.randomUUID() }
        project.tareas.push(newTask)
        return newTask
      } else {
        throw new Error('Project not found')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading tasks'
      console.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update an existing task
  const updateTaskAsync = async (projectId: ProjectId, taskId: TaskId, task: Partial<Project['tareas'][0]>) => {
    isLoading.value = true
    error.value = null
    try {
      const project = projects.value.find((p) => p.id === projectId)
      if (project) {
        const taskIndex = project.tareas.findIndex((t) => t.id === taskId)
        if (taskIndex !== -1) {
          project.tareas[taskIndex] = { ...project.tareas[taskIndex], ...task }
          return project.tareas[taskIndex]
        } else {
          throw new Error('Task not found')
        }
      } else {
        throw new Error('Project not found')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading tasks'
      console.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete a task
  const deleteTaskAsync = async (projectId: ProjectId, taskId: TaskId) => {
    isLoading.value = true
    error.value = null
    try {
      const project = projects.value.find((p) => p.id === projectId)
      if (project) {
        project.tareas = project.tareas.filter((t) => t.id !== taskId)
      } else {
        throw new Error('Project not found')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading tasks'
      console.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Date filtering
  const setDateFilter = (range: DateRange | null) => {
    dateFilter.value = range;
  };

  // Computed properties
  const getProjectById = computed(() => {
    return (id: string) => projects.value.find(proj => proj.id === id);
  });

  const getProjectsByEmployee = computed(() => {
    return (employeeId: string) => projects.value.filter(proj =>
      proj.empleadosAsignados.includes(employeeId)
    );
  });

  const filteredProjects = computed(() => {
    if (!dateFilter.value) return projects.value;

    return projects.value.filter(project => {
      const startDate = dateFilter.value?.startDate || '';
      const endDate = dateFilter.value?.endDate || '';

      // Check if project's start date is after filter start and
      // project's end date is before filter end
      return (
        (new Date(project.fechaInicio) >= new Date(startDate) &&
          new Date(project.fechaInicio) <= new Date(endDate)) ||
        (new Date(project.fechaFin) >= new Date(startDate) &&
          new Date(project.fechaFin) <= new Date(endDate)) ||
        (new Date(project.fechaInicio) <= new Date(startDate) &&
          new Date(project.fechaFin) >= new Date(endDate))
      );
    });
  });

  const delayedTasks = computed(() => {
    const result: { projectId: string; projectName: string; task: Task; delay: number }[] = [];

    projects.value.forEach(project => {
      project.tareas.forEach(task => {
        if (task.estado !== 2 && isPastDate(task.fechaLimite)) { // Not completed and past deadline
          const delay = calculateDelay(task.fechaLimite);
          if (delay > 0) {
            result.push({
              projectId: project.id,
              projectName: project.nombre,
              task,
              delay
            });
          }
        }
      });
    });

    // Sort by delay (most delayed first)
    return result.sort((a, b) => b.delay - a.delay);
  });

  // Task statistics
  const taskStatistics = computed(() => {
    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let delayed = 0;

    projects.value.forEach(project => {
      project.tareas.forEach(task => {
        total++;

        if (task.estado === 2) completed++;
        else if (task.estado === 1) inProgress++;
        else pending++;

        if (task.estado !== 2 && isPastDate(task.fechaLimite)) {
          delayed++;
        }
      });
    });

    return {
      total,
      completed,
      inProgress,
      pending,
      delayed,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      delayRate: total > 0 ? (delayed / total) * 100 : 0
    };
  });

  return {
    // Properties
    projects,
    isLoading,
    error,
    currentProject,
    dateFilter,

    // Getters
    filteredProjects,
    getProjectById,
    getProjectsByEmployee,
    taskStatistics,
    delayedTasks,

    // Actions
    fetchProjects,
    addProjectAsync,
    updateProjecyAsync,
    deleteProjectAsync,
    fetchAllTasks,
    addTaskAsync,
    updateTaskAsync,
    deleteTaskAsync,
    setDateFilter
  }
})
