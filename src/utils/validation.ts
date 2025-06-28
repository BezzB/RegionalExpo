export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  // Accepts formats: +254XXXXXXXXX, 254XXXXXXXXX, 0XXXXXXXXX
  const phoneRegex = /^(?:\+254|254|0)[17]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // If it starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    return '254' + cleaned.slice(1)
  }
  
  // If it doesn't start with 254, add it
  if (!cleaned.startsWith('254')) {
    return '254' + cleaned
  }
  
  return cleaned
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

export const validateNumeric = (value: string): boolean => {
  return /^\d+$/.test(value)
}

export const validateAlphanumeric = (value: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(value)
}

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
} 