import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { CartPage } from '@/components/cart-page'
import { CheckoutPage } from '@/components/checkout-page'
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

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
})

const routeTree = rootRoute.addChildren([indexRoute, nftDetailRoute, cartRoute, checkoutRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
