import { createRouter, createWebHistory } from 'vue-router'
import {
  Dashboard,
  EmployeeForm,
  ProjectForm,
  EmployeeList,
  ProjectTasks,
  EmployeeLayout,
  ProjectLayout,
  ProjectList,
} from '@/modules'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/employees',
      name: 'EmployeeLayout',
      redirect: {name: 'EmployeeList'},
      component: EmployeeLayout,
      children: [
        {
          path: '',
          name: 'EmployeeList',
          component: EmployeeList
        },
        {
          path: 'new',
          name: 'EmployeeNew',
          component: EmployeeForm
        },
        {
          path: ':id',
          name: 'EmployeeEdit',
          component: EmployeeForm,
          props: true
        }
      ]
    },
    {
      path: '/projects',
      name: 'ProjectLayout',
      redirect: {name: 'ProjectList'},
      component: ProjectLayout,
      children: [
        {
          path: '',
          name: 'ProjectList',
          component: ProjectList
        },
        {
          path: 'new',
          name: 'ProjectNew',
          component: ProjectForm
        },
        {
          path: ':id',
          name: 'ProjectEdit',
          component: ProjectForm,
          props: true
        },
        {
          path: ':id/tasks',
          name: 'ProjectTasks',
          component: ProjectTasks,
          props: true
        }
      ]
    }
  ]
})

export default router;
