import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import type { ComponentProps, ReactNode } from "react"

type LinkButtonProps = {
  href: string
  children: ReactNode
  asChild?: boolean
} & ComponentProps<"button"> & VariantProps<typeof buttonVariants>

export function LinkButton({
  href,
  children,
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
      className={className}
      {...props}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}
