'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/use-auth'
import { useSidebarStore } from '@/lib/stores/sidebar-store'
import { useI18n } from '@/lib/i18n'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import {
  ChevronLeft,
  Layers,
  LogOut,
  Menu,
  PenLine,
  Settings,
  Share2,
} from 'lucide-react'

const navigation = [
  { key: 'nav.knowledgeBases', href: '/notebooks', icon: Layers },
  { key: 'nav.quickNote', href: '/quick-note', icon: PenLine },
  { key: 'nav.share', href: '/share', icon: Share2 },
  { key: 'nav.settings', href: '/settings', icon: Settings },
] as const

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { isCollapsed, toggleCollapse } = useSidebarStore()
  const { t } = useI18n()

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'app-sidebar flex h-full flex-col border-r transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div
          className={cn(
            'flex h-16 items-center group',
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          )}
        >
          {isCollapsed ? (
            <div className="relative flex items-center justify-center w-full">
              <Image
                src="/logo.svg"
                alt={t('app.title')}
                width={32}
                height={32}
                className="transition-opacity group-hover:opacity-0"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="absolute text-sidebar-foreground hover:bg-sidebar-accent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt={t('app.title')} width={32} height={32} />
                <div className="flex flex-col leading-none">
                  <span className="text-base font-semibold text-sidebar-foreground">
                    {t('app.title')}
                  </span>
                  <span className="text-[10px] text-sidebar-foreground/60 tracking-wide uppercase">
                    {t('app.tagline')}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <nav
          className={cn(
            'flex-1 space-y-1 py-4',
            isCollapsed ? 'px-2' : 'px-3'
          )}
        >
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const label = t(item.key)
            const button = (
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full gap-3 text-sidebar-foreground',
                  isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                  isCollapsed ? 'justify-center px-2' : 'justify-start'
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{label}</span>}
              </Button>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      {button}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              )
            }

            return (
              <Link key={item.href} href={item.href}>
                {button}
              </Link>
            )
          })}
        </nav>

        <div
          className={cn(
            'border-t border-sidebar-border p-3 space-y-2',
            isCollapsed && 'px-2'
          )}
        >
          <div
            className={cn(
              'flex',
              isCollapsed ? 'justify-center' : 'justify-start'
            )}
          >
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ThemeToggle iconOnly />
                  </div>
                </TooltipTrigger>
                  <TooltipContent side="right">{t('theme.label')}</TooltipContent>
              </Tooltip>
            ) : (
              <ThemeToggle />
            )}
          </div>

          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{t('nav.signOut')}</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              {t('nav.signOut')}
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
