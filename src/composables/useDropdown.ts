import type { CheckboxCheckedState } from 'radix-vue'
import type { Ref } from 'vue'
import type { DropdownMenu } from '../types'

export function useDropdown(dropdown: Ref<Array<DropdownMenu>>) {
  function handleChecked(value: CheckboxCheckedState, index: number) {
    const item = dropdown.value[index]

    if (item !== undefined && item.type === 'checkbox')
      item.checked = value
  }

  function handleSelected(value: string, index: number) {
    const item = dropdown.value[index]

    if (item !== undefined && item.type === 'radio') {
      item.selected = value
    }
  }

  return {
    handleChecked,
    handleSelected,
  }
}
