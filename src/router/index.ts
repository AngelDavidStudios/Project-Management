import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/modules/projects/views/Dashboard.vue'
import EmployeeLayout from '@/modules/projects/layouts/EmployeeLayout.vue'
import EmployeeForm from '@/modules/projects/views/employee/EmployeeForm.vue'
import EmployeeList from '@/modules/projects/views/employee/EmployeeList.vue'


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
    }
  ]
})

export default router;
