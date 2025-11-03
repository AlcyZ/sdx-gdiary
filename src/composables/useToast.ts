import type { ToastProps, ToastVariant } from '../types'
import { createApp, h } from 'vue'
import IToast from '../components/IToast.vue'

interface ShowToastCallback {
  close: () => void | Promise<void>
}

export function useToast() {
  const showToast = (props: ToastProps, callbacks?: ShowToastCallback) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp({
      render() {
        return h(IToast, {
          ...props,
          onClose: () => {
            app.unmount()
            container.remove()

            callbacks?.close()
          },
        })
      },
    })

    app.mount(container)
  }

  const toast = (message: string, variant: ToastVariant, duration: number = 1500, close?: () => void) => {
    showToast({
      message,
      variant,
      duration,
    }, close ? { close } : undefined)
  }

  return {
    showToast,
    toast,
  }
}
