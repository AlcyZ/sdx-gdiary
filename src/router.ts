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
  ROUTE_PLANT_HARVEST_EDIT,
  ROUTE_PLANT_LISTING,
  ROUTE_PLANT_LOG_WATERING,
  ROUTE_SETTINGS,
} from './routes.ts'
import Gallery from './views/Gallery.vue'
import NutrientsOverview from './views/NutrientsOverview.vue'
import PlantListing from './views/PlantListing.vue'
import Settings from './views/Settings.vue'
import HarvestPlant from './viewsBackup/HarvestPlant.vue'
import HarvestPlantEdit from './viewsBackup/HarvestPlantEdit.vue'
import NotFound from './viewsBackup/NotFound.vue'
import NutrientsFertilizerAdd from './viewsBackup/NutrientsFertilizerAdd.vue'
import NutrientsSchemaAdd from './viewsBackup/NutrientsSchemaAdd.vue'
import NutrientsSchemaEdit from './viewsBackup/NutrientsSchemaEdit.vue'
import PlantAdd from './viewsBackup/PlantAdd.vue'
import PlantDetails from './viewsBackup/PlantDetails.vue'
import PlantEdit from './viewsBackup/PlantEdit.vue'
import PlantLogWatering from './viewsBackup/PlantLogWatering.vue'

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
            children: [
              {
                path: '',
                name: ROUTE_PLANT_HARVEST,
                component: HarvestPlant,
              },
              {
                path: ':harvestId',
                children: [
                  {
                    path: 'edit',
                    name: ROUTE_PLANT_HARVEST_EDIT,
                    component: HarvestPlantEdit,
                  },
                ],
              },
            ],
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
