import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import type { ComponentProps, ReactNode } from "react"

type LinkButtonProps = {
  href: string
  children: ReactNode
  asChild?: boolean
  isNavigation?: boolean
} & ComponentProps<"button"> & VariantProps<typeof buttonVariants>

export function LinkButton({
  href,
  children,
  isNavigation = false,
  variant,
  size,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={`${isNavigation ? 'rounded-full w-fit' : ''} ${className || ''}`}
      {...props}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}
