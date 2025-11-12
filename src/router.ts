import { createRouter, createWebHistory } from 'vue-router'
import DevSeed from './views/DevSeed.vue'
import NotFound from './views/NotFound.vue'
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
    component: PlantListing,
  },
  {
    path: '/dev',
    component: DevSeed,
  },
  {
    path: '/plants',
    children: [
      {
        path: '',
        name: 'plant.listing',
        component: PlantListing,
      },
      {
        path: 'add',
        name: 'plant.add',
        component: PlantAdd,
      },
      {
        path: ':plantId',
        children: [
          {
            path: '',
            name: 'plant.show',
            component: PlantDetails,
          },
          {
            path: 'edit',
            name: 'plant.edit',
            component: PlantEdit,
          },
          {
            path: 'log',
            children: [
              {
                path: 'watering',
                name: 'plant.log.watering',
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
        name: 'nutrients.overview',
        component: NutrientsOverview,
      },
      {
        path: 'fertilizer',
        children: [
          {
            path: 'add',
            name: 'nutrients.fertilizer.add',
            component: NutrientsFertilizerAdd,
          },
        ],
      },
      {
        path: 'schema',
        children: [
          {
            path: 'add',
            name: 'nutrients.schema.add',
            component: NutrientsSchemaAdd,
          },
          {
            path: ':schemaId/edit',
            name: 'nutrients.schema.edit',
            component: NutrientsSchemaEdit,
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
