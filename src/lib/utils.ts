import { Roles } from "@/types/enums"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function checkIsAdminByEmail(email:string) {
  const listOfAdminEmails = [
    'gardner.761@gmail.com'
  ]
  return listOfAdminEmails.includes(email);
}

export function checkIsAdminByRole(role: Roles) {
  return role === Roles.ADMIN;
}