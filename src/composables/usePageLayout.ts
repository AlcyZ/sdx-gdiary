import type { LayoutConfig } from '../types'
import { onMounted } from 'vue'
import { useLayout } from './useLayout.ts'

export function usePageLayout(config: LayoutConfig) {
  const { setLayout } = useLayout()

  onMounted(() => {
    setLayout(config)
  })
}
