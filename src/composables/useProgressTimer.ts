import { computed, onMounted, onUnmounted, ref } from 'vue'

export function useProgressTimer(duration?: number) {
  const startTime = ref<number | null>(null)
  const elapsed = ref(0)
  let frameId: number | null = null

  const loop = () => {
    if (startTime.value === null || duration === undefined) {
      return
    }

    const now = Date.now()
    elapsed.value = now - startTime.value

    if (elapsed.value < duration) {
      frameId = requestAnimationFrame(loop)
    }
  }

  const progress = computed(
    () => duration !== undefined
      ? 100 - (Math.min(elapsed.value / duration, 1)) * 100
      : undefined,
  )

  const remainingMs = computed(() => duration !== undefined ? Math.max(duration - elapsed.value, 0) : undefined)

  onMounted(() => {
    if (duration === undefined)
      return

    startTime.value = Date.now()
    frameId = requestAnimationFrame(loop)
  })

  onUnmounted(() => {
    if (frameId !== null)
      cancelAnimationFrame(frameId)
  })

  return {
    elapsed,
    progress,
    remainingMs,
  }
}
