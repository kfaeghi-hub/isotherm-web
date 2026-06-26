'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import type { ServiceCategory } from '@/sanity.types'

type Props = { categories: ServiceCategory[] }

export function SiteHeader({ categories }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 bg-navy border-b border-white/10">
      <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-heading font-semibold text-lg text-white tracking-tight shrink-0">
          Isotherm Engineering
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className={`inline-flex items-center h-9 px-3 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
          >
            Home
          </Link>

          {/* Services with dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 rounded-lg !bg-transparent !text-white/70 hover:!text-white hover:!bg-white/10 data-popup-open:!text-white data-popup-open:!bg-white/10 text-sm font-medium">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[520px] p-3 flex flex-col gap-0.5">
                    <NavigationMenuLink
                      href="/services"
                      className="flex flex-col gap-0.5 rounded-md px-3 py-2.5 hover:bg-paper text-left no-underline"
                    >
                      <span className="font-heading font-semibold text-navy text-sm">All Services</span>
                      <span className="text-xs text-ink/60 leading-snug">View our full range of commissioning and engineering services</span>
                    </NavigationMenuLink>
                    <div className="border-t border-line my-1" />
                    {categories.map((cat) => (
                      <NavigationMenuLink
                        key={cat._id}
                        href={`/services#${cat.slug?.current ?? ''}`}
                        className="flex flex-col gap-0.5 rounded-md px-3 py-2.5 hover:bg-paper text-left no-underline"
                      >
                        <span className="font-heading font-semibold text-navy text-sm">{cat.title}</span>
                        {cat.shortDescription && (
                          <span className="text-xs text-ink/60 leading-snug">{cat.shortDescription}</span>
                        )}
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {[
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'About',     href: '/about' },
            { label: 'Career',    href: '/career' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center h-9 px-3 rounded-lg text-sm font-medium transition-colors ${isActive(href) ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="hidden lg:inline-flex items-center px-4 py-2 rounded-sm bg-steel text-white text-sm font-medium hover:bg-steel/90 transition-colors shrink-0"
        >
          Request a Consultation
        </Link>

        {/* Mobile menu (controlled) */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="lg:hidden text-white p-1" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-navy border-white/10 p-0 w-72" showCloseButton={false}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="font-heading font-semibold text-white">Menu</span>
              <SheetClose className="text-white/70 hover:text-white p-1 rounded">
                <X className="h-5 w-5" />
              </SheetClose>
            </div>
            <nav className="p-6 flex flex-col gap-1">
              {[
                { label: 'Home',      href: '/' },
                { label: 'Services',  href: '/services' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'About',     href: '/about' },
                { label: 'Career',    href: '/career' },
                { label: 'Contact',   href: '/contact' },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`px-3 py-2.5 rounded text-sm font-medium transition-colors ${isActive(href) ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="flex items-center justify-center w-full px-4 py-2.5 rounded-sm bg-steel text-white text-sm font-medium hover:bg-steel/90 transition-colors"
                >
                  Request a Consultation
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
