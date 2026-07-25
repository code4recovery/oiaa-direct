import * as Sentry from "@sentry/browser"

// 1. Errors
export const logError = (error: any, context?: string) => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, context ? { data: { context } } : undefined)
  } else {
    console.error(context ? `❌ ${context}` : "❌ Error:", error)
  }
}

// 2. Warnings
export const logWarn = (message: string, context?: string) => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(context ? `${context}: ${message}` : message, "warning")
  } else {
    console.warn(context ? `⚠️ ${context}` : "⚠️ Warning:", message)
  }
}

// 3. Info / General Logs
export const logInfo = (message: string, context?: string) => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(context ? `${context}: ${message}` : message, "info")
  } else {
    console.log(context ? `ℹ️ ${context}` : "ℹ️ Info:", message)
  }
}
