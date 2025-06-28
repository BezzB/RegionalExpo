import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
  onDismiss?: () => void
}

export function Toast({
  className,
  variant = "default",
  onDismiss,
  children,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "default" && "bg-white border-gray-200",
        variant === "destructive" &&
          "destructive group border-red-500 bg-red-600 text-white",
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            "absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none group-hover:opacity-100",
            variant === "destructive" && "text-red-300 hover:text-red-50"
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

interface ToastTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

Toast.Title = function ToastTitle({ className, ...props }: ToastTitleProps) {
  return (
    <div
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  )
}

interface ToastDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

Toast.Description = function ToastDescription({
  className,
  ...props
}: ToastDescriptionProps) {
  return (
    <div
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  )
}

interface ToastViewportProps extends React.HTMLAttributes<HTMLOListElement> {}

function ToastViewport({ className, ...props }: ToastViewportProps) {
  return (
    <ol
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className
      )}
      {...props}
    />
  )
}

export { ToastViewport } 