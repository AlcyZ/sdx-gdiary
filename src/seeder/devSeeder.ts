import type { NewPlant } from '../modules/plants/types'
import dayjs from 'dayjs'
import FertilizerRepository from '../modules/nutrients/fertilizer_repository.ts'
import PlantRepository from '../modules/plants/plant_repository.ts'

const STRAINS = [
  'Velvet Cream',
  'Acai Grapes',
  'Fried Bananas',
  'Gelato 41',
  'Gary Payton',
  'Cereal Milk',
  'Georgia Pie',
  'London Pound Cake 75',
  'Lemon Cherry Gelato',
  'Bernie Hana Butter',
  'Sticky Buns',
  'Jealousy',
  'Gumbo',
  'Pink Rozay',

  // Classics
  'OG Kush',
  'Sour Diesel',
  'White Widow',
  'Northern Lights',
  'AK-47',
  'Blue Dream',
  'Girl Scout Cookies',
  'Amnesia Haze',
  'Super Silver Haze',
  'Jack Herer',
  'Trainwreck',
  'Pineapple Express',

  // Exotic / dessert hybrids
  'Ice Cream Cake',
  'Zkittlez',
  'Runtz',
  'Purple Punch',
  'Wedding Cake',
  'Banana Punch',
  'Sunset Sherbet',
  'Tropicana Cookies',
  'Cherry Gelato',
  'Apple Fritter',
  'Grape Gasoline',
  'Kush Mints',
  'Animal Face',

  // Fruity / tropical
  'Mango Kush',
  'Papaya',
  'Guava Gelato',
  'Strawberry Cough',
  'Orange Creamsicle',
  'Limoncello',
  'Pineapple Chunk',

  // Unique / newer genetics
  'RS11',
  'Rainbow Belts',
  'Layer Cake',
  'Donny Burger',
  'Permanent Marker',
  'Red Velvet',
  'Lava Cake',
  'Project 4516',
  'Bubble Bath',
  'Glitter Bomb',
]

const FERTILIZERS: Record<string, string[]> = {
  Hesi: [
    'Wurzelbooster',
    'PowerZyme',
    'SuperVit',
    'TNT Complex',
    'Blühkomplex',
    'PK +',
    'Blütebooster',
  ],
  BioBizz: [
    'CalMag',
    'Ph up',
    'Ph down',
  ],
  Plagron: [
    'Alge Bloom',
    'Alge Veg',
    'Wachstum AllIncl.',
    'Flower AllIncl.',
  ],
}

export default class DevSeeder {
  private readonly plantRepository: PlantRepository
  private readonly fertilizerRepository: FertilizerRepository
  // private readonly wateringSchemaRepository: WateringSchemaRepository

  private constructor(
    plantRepository: PlantRepository,
    fertilizerRepository: FertilizerRepository,
    // wateringSchemaRepository: WateringSchemaRepository,
  ) {
    this.plantRepository = plantRepository
    this.fertilizerRepository = fertilizerRepository
    // this.wateringSchemaRepository = wateringSchemaRepository
  }

  public static async create(): Promise<DevSeeder> {
    const [
      plantRepository,
      fertilizerRepository,
      // wateringSchemaRepository,
    ] = await Promise.all([
      PlantRepository.create(),
      FertilizerRepository.create(),
      // WateringSchemaRepository.create(),
    ])

    return new DevSeeder(plantRepository, fertilizerRepository/* , wateringSchemaRepository */)
  }

  public async seed(plantsCount: number = 6) {
    for (let i = 0; i < plantsCount; i++) {
      await this.seedPlant()
    }

    await this.seedFertilizers()
  }

  private async seedPlant() {
    const data: NewPlant = {
      strain: randomArrayElement(STRAINS),
      container: {
        container: 'Air Pot',
        medium: 'soil',
        volume: 12,
      },
      phases: [
        {
          phase: 'germination',
          startedAt: dayjs().format('YYYY-MM-DDTHH:mm'),
        },
      ],
    }
    await this.plantRepository.save(data)
  }

  private async seedFertilizers() {
    const promises = Object.entries(FERTILIZERS)
      .flatMap(([manufacturer, names]) => names.map(name => ({ name, manufacturer })))
      .map(data => this.fertilizerRepository.save(data))

    await Promise.all(promises)
  }
}

function randomArrayElement(array: Array<string>): string {
  return array[Math.floor(Math.random() * array.length)] || ''
}
