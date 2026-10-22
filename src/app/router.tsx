import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { CartPage } from '@/components/cart-page'
import { CheckoutPage } from '@/components/checkout-page'
import { HomePage } from '@/components/home-page'
import { NftDetailPage } from '@/components/nft-detail-page'
import { OrdersPage, ProfilePage, WalletsPage } from '@/components/account-pages'
import { useRealtimeSocket } from '@/hooks/use-realtime-socket'

function RootLayout() {
  useRealtimeSocket()
  return <Outlet />
}

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>) => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    collection: typeof search.collection === 'string' ? search.collection : undefined,
    network: typeof search.network === 'string' ? search.network : undefined,
    minPrice: typeof search.minPrice === 'string' ? search.minPrice : undefined,
    maxPrice: typeof search.maxPrice === 'string' ? search.maxPrice : undefined,
    sort: typeof search.sort === 'string' ? search.sort : 'recent',
    page: typeof search.page === 'number' && search.page > 0 ? Math.floor(search.page) : 1,
  }),
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

const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profile', component: ProfilePage })
const walletsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/wallets', component: WalletsPage })
const ordersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/orders', component: OrdersPage })

const routeTree = rootRoute.addChildren([indexRoute, nftDetailRoute, cartRoute, checkoutRoute, profileRoute, walletsRoute, ordersRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
