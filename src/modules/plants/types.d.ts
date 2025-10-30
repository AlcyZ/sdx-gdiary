interface Plant {
  id: string
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
  id: string
  name: string
  strain: string
  poppedAt: string
} & Timestamps

interface PlantImageRow {
  id: number
  plantId: number
  blob: Blob
}
