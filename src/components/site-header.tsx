import Link from "next/link"
import { siteConfig } from "@/lib/config"

import { fontPermanentMarker } from "@/lib/fonts"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { LinkButton } from "./LinkButton"

const adminItems = [
  { href: '/admin', label: 'Admin' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/drivers', label: 'Drivers' },
]

export function SiteHeader() {
  //const colors = getColors()
  //const pageTree = source.pageTree

  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="3xl:fixed:container flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:!h-4">
          <MobileNav

            items={siteConfig.navItems}
            adminItems={adminItems}
            className="flex lg:hidden"
          />
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden size-8 lg:flex"
          >
            <Link href="/">
              <Icons.logo className="size-5" />
              <span className="sr-only">{'jake'}</span>
            </Link>
          </Button>
          <MainNav items={siteConfig.navItems} className="hidden lg:flex bg-amber-400" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end ">
            <LinkButton href='/dashboard' variant='link'
              className={`absolute left-1/2 -translate-x-1/2 flex h-8 items-center text-lg leading-none ${fontPermanentMarker.className}`}>
              HardCharger

            </LinkButton>
            <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">

            </div>
            <Separator
              orientation="vertical"
              className="ml-2 hidden lg:block"
            />

            <Separator orientation="vertical" className="3xl:flex hidden" />

            <Separator orientation="vertical" />
            <ModeSwitcher />
            <Separator orientation="vertical" />

            <SignedOut>
              <SignInButton>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

          </div>
        </div>
      </div>
    </header>
  )
}
