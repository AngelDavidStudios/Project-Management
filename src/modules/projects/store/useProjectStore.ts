import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { DateRange, Project, ProjectId, Task, TaskId } from '@/types'
import {
  createProject, createTask,
  deleteProject, deleteTask,
  fetchAllProjects, fetchAllTasks,
  fetchProjectById,
  updateProject, updateTask
} from '@/modules/projects/api/apiService.ts'
import { calculateDelay, isPastDate } from '@/types/date.ts'


export const useProjectStore = defineStore('projectStore', () => {
  const projects = ref<Project[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentProject = ref<Project | null>(null)
  const dateFilter = ref<DateRange | null>(null)

  const showDeleteModal = ref(false);
  const projectToDelete = ref<string | null>(null);

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

  // Get a project by ID
  const fetchProjectByIdAsync = async (id: ProjectId) => {
    isLoading.value = true
    error.value = null
    try {
      currentProject.value = await fetchProjectById(id)
      return currentProject.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading project'
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

  const confirmDelete = (id: string) => {
    projectToDelete.value = id;
    showDeleteModal.value = true;
  }

  const cancelDelete = () => {
    projectToDelete.value = null;
    showDeleteModal.value = false;
  }

  // Tasks CRUD operations

  // Fetch all tasks for a project
  const fetchAllTasksAsync = async (projectId: ProjectId) => {
    isLoading.value = true;
    error.value = null;
    try {
      const tasks = await fetchAllTasks(projectId);
      const project = projects.value.find((p) => p.id === projectId);
      if (project) {
        project.tareas = tasks;
        if (currentProject.value?.id === projectId) {
          currentProject.value.tareas = tasks; // Asegúrate de actualizar `currentProject`
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching tasks';
      console.error(error.value);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Add a new task to a project
const addTaskAsync = async (projectId: ProjectId, task: Task) => {
  isLoading.value = true;
  error.value = null;
    try {
      const newTask = await createTask(projectId, task);
      const project = projects.value.find((p) => p.id === projectId);
      if (project) {
        project.tareas.push(newTask);
      }
      return newTask;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error creating task';
      console.error(error.value);
      throw err;
    } finally {
      isLoading.value = false;
    }
};

  // Update an existing task
  const updateTaskAsync = async (projectId: ProjectId, taskId: TaskId, task: Partial<Task>) => {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedTask = await updateTask(projectId, taskId, task);
      const project = projects.value.find((p) => p.id === projectId);
      if (project) {
        const taskIndex = project.tareas.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          project.tareas[taskIndex] = { ...project.tareas[taskIndex], ...updatedTask };
          project.tareas = [...project.tareas]; // Forzar reactividad
        }
      }
      return updatedTask;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error updating task';
      console.error(error.value);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a task
  const deleteTaskAsync = async (projectId: ProjectId, taskId: TaskId) => {
    isLoading.value = true;
    error.value = null;
    try {
      await deleteTask(projectId, taskId);
      const project = projects.value.find((p) => p.id === projectId);
      if (project) {
        project.tareas = project.tareas.filter((t) => t.id !== taskId);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error deleting task';
      console.error(error.value);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

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
        if (task.estado === 3 && isPastDate(task.fechaLimite)) { // Not completed and past deadline
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
    showDeleteModal,
    projectToDelete,

    // Getters
    filteredProjects,
    getProjectById,
    getProjectsByEmployee,
    taskStatistics,
    delayedTasks,

    // Actions
    fetchProjects,
    fetchProjectByIdAsync,
    addProjectAsync,
    updateProjecyAsync,
    deleteProjectAsync,
    fetchAllTasksAsync,
    addTaskAsync,
    updateTaskAsync,
    deleteTaskAsync,
    setDateFilter,
    confirmDelete,
    cancelDelete,
  }
})
