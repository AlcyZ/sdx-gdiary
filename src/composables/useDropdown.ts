import type { CheckboxCheckedState } from 'radix-vue'
import type { Component, Ref, VNodeChild } from 'vue'
import type { DropdownMenu } from '../types'
import { Fragment, h } from 'vue'

export function useDropdown(dropdown?: Ref<Array<DropdownMenu>>) {
  function handleChecked(value: CheckboxCheckedState, index: number) {
    const item = dropdown?.value[index]

    if (item !== undefined && item.type === 'checkbox')
      item.checked = value
  }

  function handleSelected(value: string, index: number) {
    const item = dropdown?.value[index]

    if (item !== undefined && item.type === 'radio') {
      item.selected = value
    }
  }

  function createItem(label: string, icon: Component): VNodeChild {
    return h(Fragment, [
      h(icon),
      label,
    ])
  }

  return {
    handleChecked,
    handleSelected,
    createItem,
  }
}
