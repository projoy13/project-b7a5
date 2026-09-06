'use client'

import Link from 'next/link'
import {
  Bell,
  ChevronDown,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

const navItems = [
  { label: 'Overview', href: '#overview', icon: LayoutDashboard },
  { label: 'Features', href: '#features', icon: Sparkles },
  { label: 'Pricing', href: '#pricing', icon: CreditCard },
  { label: 'Updates', href: '#updates', icon: Bell },
]

const userMenuItems = [
  { label: 'Account settings', icon: Settings },
  { label: 'Help center', icon: HelpCircle },
]

export function Navbar() {
  return (
    <header className="border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="#overview"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Northstar home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles aria-hidden="true" />
          </span>
          <span className="font-sans text-base font-semibold tracking-tight">
            Northstar
          </span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  href={item.href}
                  className="px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
<DropdownMenu>
  <DropdownMenuTrigger
    render={
      <Button
        variant="ghost"
        className="h-auto gap-2 px-1.5 py-1.5"
      />
    }
  >
    <Avatar size="sm">
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>

    <span className="hidden text-sm font-medium sm:inline">
      Jordan Davis
    </span>

    <ChevronDown aria-hidden="true" />

    <span className="sr-only">Open user menu</span>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuGroup>
      <DropdownMenuLabel>
        <p className="font-medium">Jordan Davis</p>
        <p className="font-normal text-muted-foreground">
          jordan@example.com
        </p>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      {userMenuItems.map((item) => {
        const Icon = item.icon;

        return (
          <DropdownMenuItem key={item.label}>
            <Icon aria-hidden="true" />
            {item.label}
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuGroup>

    <DropdownMenuSeparator />

    <DropdownMenuItem variant="destructive">
      <LogOut aria-hidden="true" />
      Sign out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
      </div>
    </header>
  )
}