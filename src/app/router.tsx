import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { HomeHeader } from '@/components/home-header'
import { HomeHero } from '@/components/home-hero'
import { PromotionalBanners } from '@/components/promotional-banners'
import { BlogCards } from '@/components/blog-cards'
import { HomeFilters } from '@/components/home-filters'
import { FeaturedNftBanner } from '@/components/featured-nft-banner'
import { NftMarketplaceGrid } from '@/components/nft-marketplace-grid'
import { HomeFooter } from '@/components/home-footer'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <>
      <main id="inicio" className="min-h-screen">
        <HomeHeader />
        <HomeHero />
        <div className="mx-auto mt-24 w-full max-w-300 px-4 md:px-0">
          <div className="flex w-full flex-col gap-8 xl:flex-row">
            <div className="flex w-77.5 shrink-0 flex-col gap-5">
              <HomeFilters />
              <FeaturedNftBanner />
            </div>
            <NftMarketplaceGrid />
          </div>
        </div>
        <PromotionalBanners />
        <BlogCards />
      </main>
      <HomeFooter />
    </>
  ),
})
const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}
