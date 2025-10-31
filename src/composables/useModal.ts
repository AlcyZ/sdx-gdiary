import type { ShowConfirmationModalProps } from '../types'
import { createApp, h } from 'vue'
import IModalConfirmation from '../components/IModalConfirmation.vue'

export function useModal() {
  const showConfirmationModal = (props: ShowConfirmationModalProps) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp({
      render() {
        return h(IModalConfirmation, {
          ...props,
          onClose: () => {
            app.unmount()
            container.remove()
          },
        })
      },
    })

    app.mount(container)
  }

  return {
    showConfirmationModal,
  }
}
