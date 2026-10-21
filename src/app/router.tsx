import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { HomePage } from '@/components/home-page'
import { NftDetailPage } from '@/components/nft-detail-page'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$nftId',
  component: NftDetailPage,
})

const routeTree = rootRoute.addChildren([indexRoute, nftDetailRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
