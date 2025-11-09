import { createRouter, createWebHistory } from 'vue-router'
import DevSeed from './views/DevSeed.vue'
import NutrientsFertilizerAdd from './views/NutrientsFertilizerAdd.vue'
import NutrientsOverview from './views/NutrientsOverview.vue'
import NutrientsSchemaAdd from './views/NutrientsSchemaAdd.vue'
import NutrientsSchemaEdit from './views/NutrientsSchemaEdit.vue'
import PlantAdd from './views/PlantAdd.vue'
import PlantDetails from './views/PlantDetails.vue'
import PlantEdit from './views/PlantEdit.vue'
import PlantListing from './views/PlantListing.vue'
import PlantLogWatering from './views/PlantLogWatering.vue'

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
      {
        path: 'add',
        component: PlantAdd,
      },
      {
        path: ':plantId',
        children: [
          {
            path: '',
            component: PlantDetails,
          },
          {
            path: 'edit',
            component: PlantEdit,
          },
          {
            path: 'log',
            children: [
              {
                path: 'watering',
                component: PlantLogWatering,
              },
            ],
          },
        ],
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
