interface Plant {
  id: number
  strain: string
  name: string
  poppedAt: string
  image: string
  createdAt: string
  updatedAt: string
}

interface NewPlant {
  strain: string
  name?: string
  poppedAt: string
  image: string
}

interface Timestamps {
  createdAt: string
  updatedAt: string
}

type PlantRow = {
  id: number
  name: string
  strain: string
  poppedAt: string
} & Timestamps

interface PlantImageRow {
  id: number
  plantId: number
  image: Blob
}

interface SavePlantError {
  image?: string
  strain?: string
  poppedAt?: string
  unknown?: string
}
