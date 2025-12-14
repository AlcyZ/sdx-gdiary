import { ref } from 'vue'

const isDockVisible = ref(true)
const isTopNavigationVisible = ref(false)

interface UseLayoutOptions {
  dockVisible?: boolean
  topNavigationVisible?: boolean
}

export function useLayout(opts?: UseLayoutOptions) {
  const { dockVisible, topNavigationVisible } = opts || {}

  if (dockVisible)
    isDockVisible.value = dockVisible

  if (topNavigationVisible)
    isTopNavigationVisible.value = topNavigationVisible

  function showDock() {
    isDockVisible.value = true
  }

  function hideDock() {
    isDockVisible.value = false
  }

  function toggleDock() {
    isDockVisible.value = !isDockVisible.value
  }

  function showTopNavigation() {
    isTopNavigationVisible.value = true
  }

  function hideTopNavigation() {
    isTopNavigationVisible.value = false
  }

  function toggleTopNavigationVisible() {
    isTopNavigationVisible.value = !isTopNavigationVisible.value
  }

  return {
    isDockVisible,
    isTopNavigationVisible,
    showDock,
    hideDock,
    toggleDock,
    showTopNavigation,
    hideTopNavigation,
    toggleTopNavigationVisible,
  }
}
