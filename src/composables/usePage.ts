import { ref } from 'vue'

export function usePage<P extends string>(startPage: P) {
  const page = ref<P>(startPage)
  const changePage = (newPage: P) => page.value = newPage

  return {
    page,
    changePage,
  }
}
