import type { LayoutConfig, TopNavigationProps } from '../types'
import { ref } from 'vue'

const isDockVisible = ref(true)
const topNavigationProps = ref<TopNavigationProps | undefined>()

export function useLayout() {
  function setLayout({ dock, topNavigation }: LayoutConfig) {
    isDockVisible.value = dock !== undefined && dock
    topNavigationProps.value = topNavigation
  }

  return {
    isDockVisible,
    topNavigationProps,
    setLayout,
  }
}
