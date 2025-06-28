import {
  Toast,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import * as React from "react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastViewport>
      {toasts?.map(function ({
        id,
        title,
        description,
        variant,
      }) {
        return (
          <Toast key={id} variant={variant} onDismiss={() => dismiss(id)}>
            {title && <Toast.Title>{title}</Toast.Title>}
            {description && (
              <Toast.Description>{description}</Toast.Description>
            )}
          </Toast>
        )
      })}
    </ToastViewport>
  )
} 