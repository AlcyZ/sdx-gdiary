import type { Component, VNodeProps } from 'vue'
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

  const showModal = <P extends Record<string, any>>(
    component: Component<P>,
    props: P,
  ) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp({
      render() {
        // Merge user props with mandatory onClose
        const modalProps = {
          ...props,
          onClose: () => {
            app.unmount()
            container.remove()

            if ('onClose' in props && typeof props.onClose === 'function') {
              props.onClose()
            }
          },
        } as VNodeProps & P

        return h(component, modalProps)
      },
    })

    app.mount(container)
  }

  return {
    showConfirmationModal,
    showModal,
  }
}
