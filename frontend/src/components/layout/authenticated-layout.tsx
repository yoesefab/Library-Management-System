import { Navigate, Outlet, useLocation } from '@tanstack/react-router'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { getCookie } from '@/lib/cookies'
import { entranceTransition, getMotionState, pageVariants } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { useSession } from '@/context/session-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const session = useSession()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const motionState = getMotionState(reduceMotion)
  if (session.loading) return null
  if (!session.user) {
    if (
      ['/sign-in', '/sign-in-2', '/sign-up', '/forgot-password', '/otp'].some(
        (path) => location.pathname.startsWith(path)
      )
    )
      return null
    return (
      <Navigate to='/sign-in' search={{ redirect: location.href }} replace />
    )
  }
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-data-[layout=fixed]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            <AnimatePresence initial={false} mode='wait'>
              <motion.div
                key={location.pathname}
                className='flex min-h-0 flex-1 flex-col'
                variants={pageVariants}
                transition={entranceTransition}
                {...motionState}
              >
                {children ?? <Outlet />}
              </motion.div>
            </AnimatePresence>
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
