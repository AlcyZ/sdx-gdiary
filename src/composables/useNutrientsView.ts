import type { FabAction } from '../types'
import { Beaker as IconFertilizer, List as IconList, Droplet as IconWateringSchema } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useNutrientsView() {
  const router = useRouter()

  const fabActions = ref<Array<FabAction>>([
    {
      icon: IconWateringSchema,
      onClick: () => router.push('/nutrients/schema/add'),
    },
    {
      icon: IconFertilizer,
      onClick: () => router.push('/nutrients/fertilizer/add'),
    },
    {
      icon: IconList,
      onClick: () => router.push('/nutrients'),
    },
  ])

  return {
    fabActions,
  }
}
