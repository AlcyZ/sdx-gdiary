import { createMemoryHistory, createRouter } from 'vue-router'
import ViewHome from './views/ViewHome.vue'
import ViewPlants from './views/ViewPlants.vue'

const routes = [
  { path: '/', component: ViewHome },
  { path: '/plants', component: ViewPlants },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
