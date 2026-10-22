import { useState } from 'react'
import { BlogCards } from '@/components/blog-cards'
import { FeaturedNftBanner } from '@/components/featured-nft-banner'
import { HomeFilters } from '@/components/home-filters'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { HomeHero } from '@/components/home-hero'
import { NftMarketplaceGrid } from '@/components/nft-marketplace-grid'
import { PromotionalBanners } from '@/components/promotional-banners'

export function HomePage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([2, 1230])
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  return (
    <>
      <main id="inicio" className="min-h-screen pb-24 md:pb-0">
        <HomeHeader
          mobileHomeLayout
          onMobileFiltersClick={() => setIsMobileFiltersOpen((isOpen) => !isOpen)}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
        <HomeHero />
        <div className="mx-auto mt-4 w-full max-w-300 px-6 md:mt-24 md:px-0">
          <div className="flex w-full flex-col gap-0 xl:flex-row xl:gap-8">
            <div className="flex w-77.5 shrink-0 flex-col gap-5 max-md:hidden">
              <HomeFilters
                onCollectionChange={setSelectedCollection}
                onNetworkChange={setSelectedNetwork}
                onPriceRangeApply={setPriceRange}
                priceRange={priceRange}
                selectedCollection={selectedCollection}
                selectedNetwork={selectedNetwork}
              />
              <FeaturedNftBanner />
            </div>
            <NftMarketplaceGrid
              priceRange={priceRange}
              selectedCollection={selectedCollection}
              selectedNetwork={selectedNetwork}
              searchQuery={searchQuery}
            />
          </div>
        </div>
        <PromotionalBanners />
        <BlogCards />
        {isMobileFiltersOpen && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/70 px-4 pb-8 pt-16 md:hidden"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            <div
              aria-label="Filtros do mercado"
              aria-modal="true"
              className="relative mx-auto min-w-50 max-w-91.5 rounded-xl bg-background p-3"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <button
                aria-label="Fechar filtros"
                className="absolute right-6 top-4 md:right-3 md:top-2 z-10 text-primary"
                onClick={() => setIsMobileFiltersOpen(false)}
                type="button"
              >
                ×
              </button>
              <HomeFilters
                className="max-md:w-full max-md:px-3 max-md:pt-8"
                onCollectionChange={setSelectedCollection}
                onNetworkChange={setSelectedNetwork}
                onPriceRangeApply={setPriceRange}
                priceRange={priceRange}
                selectedCollection={selectedCollection}
                selectedNetwork={selectedNetwork}
              />
            </div>
          </div>
        )}
      </main>
      <HomeFooter />
    </>
  )
}
