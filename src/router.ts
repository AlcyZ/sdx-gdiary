import { createRouter, createWebHistory } from 'vue-router'
import DevSeed from './views/DevSeed.vue'
import NutrientsFertilizerAdd from './views/NutrientsFertilizerAdd.vue'
import NutrientsOverview from './views/NutrientsOverview.vue'
import NutrientsSchemaAdd from './views/NutrientsSchemaAdd.vue'
import NutrientsSchemaEdit from './views/NutrientsSchemaEdit.vue'
import PlantListing from './views/PlantListing.vue'

const routes = [
  {
    path: '/',
    component: DevSeed,
  },
  {
    path: '/plants',
    children: [
      {
        path: '',
        component: PlantListing,
      },
    ],
  },
  {
    path: '/nutrients',
    children: [
      {
        path: '',
        component: NutrientsOverview,
      },
      {
        path: 'fertilizer',
        children: [
          {
            path: 'add',
            component: NutrientsFertilizerAdd,
          },
        ],
      },
      {
        path: 'schema',
        children: [
          {
            path: 'add',
            component: NutrientsSchemaAdd,
          },
          {
            path: ':schemaId/edit',
            component: NutrientsSchemaEdit,
          },
        ],
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
