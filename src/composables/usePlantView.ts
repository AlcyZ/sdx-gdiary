import type { FabAction } from '../types'
import { Leaf as IconList, CirclePlus as IconNew } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function usePlantView() {
  const router = useRouter()

  const fabActions = ref<Array<FabAction>>([
    {
      icon: IconNew,
      onClick: () => router.push('/plants/add'),
    },
    {
      icon: IconList,
      onClick: () => router.push('/plants'),
    },
  ])

  return {
    fabActions,
  }
}
