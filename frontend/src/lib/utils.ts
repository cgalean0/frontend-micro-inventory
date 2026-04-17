import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium'
  }).format(new Date(date))
}
