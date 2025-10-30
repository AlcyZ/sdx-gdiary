interface Plant {
  id: number
  strain: string
  name: string
  poppedAt: string
  image: string
  createdAt: string
  updatedAt: string
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
