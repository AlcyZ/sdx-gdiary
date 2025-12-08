import { createRouter, createWebHistory } from 'vue-router'
import {
  ROUTE_404,
  ROUTE_GALLERY,
  ROUTE_NUTRIENTS_FERTILIZER_ADD,
  ROUTE_NUTRIENTS_OVERVIEW,
  ROUTE_NUTRIENTS_SCHEMA_ADD,
  ROUTE_NUTRIENTS_SCHEMA_EDIT,
  ROUTE_PLANT_ADD,
  ROUTE_PLANT_DETAILS,
  ROUTE_PLANT_EDIT,
  ROUTE_PLANT_HARVEST,
  ROUTE_PLANT_LISTING,
  ROUTE_PLANT_LOG_WATERING,
  ROUTE_SETTINGS,
} from './routes.ts'
import Gallery from './views/Gallery.vue'
import HarvestPlant from './views/HarvestPlant.vue'
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
import Settings from './views/Settings.vue'

const routes = [
  {
    path: '/',
    component: PlantListing,
  },
  {
    path: '/plants',
    children: [
      {
        path: '',
        name: ROUTE_PLANT_LISTING,
        component: PlantListing,
      },
      {
        path: 'add',
        name: ROUTE_PLANT_ADD,
        component: PlantAdd,
      },
      {
        path: ':plantId',
        children: [
          {
            path: '',
            name: ROUTE_PLANT_DETAILS,
            component: PlantDetails,
          },
          {
            path: 'edit',
            name: ROUTE_PLANT_EDIT,
            component: PlantEdit,
          },
          {
            path: 'harvest',
            name: ROUTE_PLANT_HARVEST,
            component: HarvestPlant,
          },
          {
            path: 'log',
            children: [
              {
                path: 'watering',
                name: ROUTE_PLANT_LOG_WATERING,
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
        name: ROUTE_NUTRIENTS_OVERVIEW,
        component: NutrientsOverview,
      },
      {
        path: 'fertilizer',
        children: [
          {
            path: 'add',
            name: ROUTE_NUTRIENTS_FERTILIZER_ADD,
            component: NutrientsFertilizerAdd,
          },
        ],
      },
      {
        path: 'schema',
        children: [
          {
            path: 'add',
            name: ROUTE_NUTRIENTS_SCHEMA_ADD,
            component: NutrientsSchemaAdd,
          },
          {
            path: ':schemaId/edit',
            name: ROUTE_NUTRIENTS_SCHEMA_EDIT,
            component: NutrientsSchemaEdit,
          },
        ],
      },
    ],
  },
  {
    path: '/gallery',
    name: ROUTE_GALLERY,
    component: Gallery,
  },
  {
    path: '/settings',
    name: ROUTE_SETTINGS,
    component: Settings,
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_404,
    component: NotFound,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
